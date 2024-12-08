import { 
    Injectable, 
    NotFoundException, 
    BadRequestException,
    InternalServerErrorException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hotel } from './hotels.entity';
import * as csv from 'csv-parser';
import { createReadStream } from 'fs';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';


@Injectable()
export class HotelsService {
    constructor(
        @InjectRepository(Hotel)
        private hotelRepository: Repository<Hotel>,
    ) {}

    // 從 CSV 檔案新增飯店
    // @param csvFilePath: string
    // @returns Promise<number[]>
    async addHotelFromCsv(csvFilePath: string) : Promise<number[]> {
        if (!csvFilePath) {
            throw new BadRequestException('CSV file path is required');
        }

        const hotels = [];
        return new Promise((resolve, reject) => {
            createReadStream(csvFilePath)
                .pipe(csv())
                .on('data', (data) => {
                    const hotel = new Hotel();
                    hotel.name = data.name;
                    hotel.address = data.address + ', ' + data.city + ', ' + data.country;
                    hotel.email = data.email;
                    hotel.status = data.is_open ? 1 : 0;
                    hotel.coordinate = `${data.longitude},${data.latitude}`;
                    if (!this.validateHotelData(hotel.name, hotel.address, hotel.email, hotel.status, hotel.coordinate)) {
                        reject(new BadRequestException('CSV file missing required fields'));
                    }
                    hotels.push(hotel);
                })
                .on('end', () => {
                    if (hotels.length === 0) {
                        reject(new BadRequestException('CSV file is empty'));
                    }
                    resolve(this.addHotels(hotels).then((hotels) => hotels.map((hotel) => hotel.id)));
                })
                .on('error', () => {
                    reject(new InternalServerErrorException('Failed to process CSV file'));
                });
        });
    }

    // 新增飯店
    // @param hotelDto: HotelDto
    // @returns Promise<number>
    async addHotel(createHotelDto: CreateHotelDto) : Promise<number> {
        if (!this.validateHotelData(createHotelDto.name, createHotelDto.address, createHotelDto.email, createHotelDto.status, createHotelDto.coordinate)) {
            throw new BadRequestException('Missing required fields');
        }
        const hotel = await this.addHotels([createHotelDto]);
        return hotel[0].id;
    }

    // 取得所有飯店資訊
    // @returns Promise<Hotel[]>
    async getHotels() : Promise<Hotel[]> {
        try {
            return await this.hotelRepository.find();
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve hotels');
        }
    }

    // 取得單一飯店資訊
    // @param id: number
    // @returns Promise<Hotel>
    async getHotel(id: number) : Promise<Hotel> {
        if (!id) {
            throw new BadRequestException('Hotel ID is required');
        }
        
        try {
            const hotel = await this.hotelRepository.findOne({ where: { id } });
            if (!hotel) {
                throw new NotFoundException(`Hotel with ID ${id} not found`);
            }
            return hotel;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to retrieve hotel');
        }
    }

    // 修改飯店
    // @param id: number
    // @param updateHotelDto: UpdateHotelDto
    // @returns Promise<Hotel>
    async updateHotel(id: number, updateHotelDto: UpdateHotelDto) : Promise<Hotel> {
        if (!id) {
            throw new BadRequestException('Hotel ID is required');
        }

        try {
            const hotel = await this.hotelRepository.findOne({ where: { id } });
            if (!hotel) {
                throw new NotFoundException(`Hotel with ID ${id} not found`);
            }

            // Update given fields of the hotel
            Object.assign(hotel, {
                name: updateHotelDto.name ?? hotel.name,
                webLink: updateHotelDto.webLink ?? hotel.webLink,
                address: updateHotelDto.address ?? hotel.address,
                email: updateHotelDto.email ?? hotel.email,
                status: updateHotelDto.status ?? hotel.status,
                coordinate: updateHotelDto.coordinate ?? hotel.coordinate,
            });

            return await this.hotelRepository.save(hotel);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to update hotel');
        }
    }

    // validate hotel data
    private validateHotelData(name: string, address: string, email: string, status: number, coordinate: string) {
        if (!name || !address || !email || !status || !coordinate) {
            return false;
        }
        return true;
    }

    // 新增飯店
    // @param hotelDtos: HotelDto[]
    // @returns Promise<Hotel[]>
    private async addHotels(createHotelDtos: CreateHotelDto[]) : Promise<Hotel[]> {
        try {
            const hotels = createHotelDtos.map((createHotelDto) => {
                const hotel = new Hotel();
                hotel.name = createHotelDto.name;
                hotel.webLink = createHotelDto.webLink;
                hotel.address = createHotelDto.address;
                hotel.email = createHotelDto.email;
                hotel.status = createHotelDto.status;
                hotel.coordinate = createHotelDto.coordinate;
                return hotel;
            });
            return await this.hotelRepository.save(hotels);
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to add hotels');
        }
    }
}
