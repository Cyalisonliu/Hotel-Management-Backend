import { Test, TestingModule } from '@nestjs/testing';
import { HotelsController } from './hotels.controller';
import { HotelsService } from './hotels.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('HotelsController', () => {
    let hotelsController: HotelsController;
    let hotelsService: HotelsService;

    const mockHotelsService = {
        getHotels: jest.fn(),
        getHotel: jest.fn(),
        addHotelFromCsv: jest.fn(),
        addHotel: jest.fn(),
        updateHotel: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [HotelsController],
            providers: [
                {
                    provide: HotelsService,
                    useValue: mockHotelsService,
                },
            ],
        }).compile();

        hotelsController = module.get<HotelsController>(HotelsController);
        hotelsService = module.get<HotelsService>(HotelsService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getHotels for getting all hotels', () => {
        it('should return array of hotels', async () => {
            const mockHotels = [
                {
                    id: 1,
                    name: 'Hotel 1',
                    address: 'Address 1',
                    email: 'email@example.com',
                    status: 1,
                    coordinate: '123,456'
                }
            ];
            
            mockHotelsService.getHotels.mockResolvedValue(mockHotels);

            const result = await hotelsController.getHotels();
            
            expect(result.data).toEqual(mockHotels);
            expect(hotelsService.getHotels).toHaveBeenCalled();
        });
    });

    describe('getHotel for getting a hotel by id', () => {
        it('should return a hotel by id', async () => {
            const mockHotel = {
                id: 1,
                name: 'Hotel 1',
                address: 'Address 1',
                email: 'email@example.com',
                status: 1,
                coordinate: '123,456'
            };
            
            mockHotelsService.getHotel.mockResolvedValue(mockHotel);

            const result = await hotelsController.getHotel(1);
            
            expect(result.data).toEqual(mockHotel);
            expect(hotelsService.getHotel).toHaveBeenCalledWith(1);
        });

        it('should throw NotFoundException when hotel not found', async () => {
            mockHotelsService.getHotel.mockRejectedValue(new NotFoundException());
            
            await expect(hotelsController.getHotel(-1)).rejects.toThrow(NotFoundException);
        });
    });

    describe('addHotel for adding a single hotel', () => {
        it('should create a hotel and return its id', async () => {
            const mockHotelDto = {
                name: 'New Hotel',
                address: 'New Address',
                email: 'new@example.com',
                status: 1,
                coordinate: '123,456'
            };
            
            mockHotelsService.addHotel.mockResolvedValue(1);

            const result = await hotelsController.addHotel(mockHotelDto);
            
            expect(result.data).toBe(1);
            expect(hotelsService.addHotel).toHaveBeenCalledWith(mockHotelDto);
        });

        it('should throw BadRequestException for invalid data', async () => {
            const invalidDto = {
                name: '',
                address: 'Address',
                email: 'email@example.com',
                status: 1,
                coordinate: '123,456'
            };
            
            mockHotelsService.addHotel.mockRejectedValue(new BadRequestException());
            
            await expect(hotelsController.addHotel(invalidDto)).rejects.toThrow(BadRequestException);
        });
    });

    describe('uploadFile for addHotelsFromCsv', () => {
        it('should upload CSV and return array of hotel IDs', async () => {
            const mockFile = {
                path: './uploads/test.csv',
                originalname: 'test.csv',
            };
            const mockHotelIds = [1, 2, 3];
            
            mockHotelsService.addHotelFromCsv.mockResolvedValue(mockHotelIds);

            const result = await hotelsController.uploadFile(mockFile);
            
            expect(result.data).toEqual(mockHotelIds);
            expect(hotelsService.addHotelFromCsv).toHaveBeenCalledWith(mockFile.path);
        });

        it('should throw BadRequestException when no file provided', async () => {
            await expect(hotelsController.uploadFile(null)).rejects.toThrow(BadRequestException);
            expect(hotelsService.addHotelFromCsv).not.toHaveBeenCalled();
        });

        it('should throw BadRequestException when CSV has invalid data', async () => {
            const mockFile = {
                path: './uploads/invalid.csv',
                originalname: 'invalid.csv',
            };
            
            mockHotelsService.addHotelFromCsv.mockRejectedValue(new BadRequestException());

            await expect(hotelsController.uploadFile(mockFile)).rejects.toThrow(BadRequestException);
        });
    });

    describe('updateHotel for updating a hotel', () => {
        it('should update hotel and return updated data', async () => {
            const mockUpdateDto = {
                name: 'Updated Hotel',
                status: 0,
            };
            
            const mockUpdatedHotel = {
                id: 1,
                name: 'Updated Hotel',
                address: 'Existing Address',
                email: 'existing@example.com',
                status: 0,
                coordinate: '123,456'
            };
            
            mockHotelsService.updateHotel.mockResolvedValue(mockUpdatedHotel);

            const result = await hotelsController.updateHotel(1, mockUpdateDto);
            
            expect(result.data).toEqual(mockUpdatedHotel);
            expect(hotelsService.updateHotel).toHaveBeenCalledWith(1, mockUpdateDto);
        });

        it('should throw NotFoundException when updating non-existent hotel', async () => {
            const mockUpdateDto = {
                name: 'Updated Hotel',
            };
            
            mockHotelsService.updateHotel.mockRejectedValue(new NotFoundException());

            await expect(hotelsController.updateHotel(-1, mockUpdateDto))
                .rejects.toThrow(NotFoundException);
        });
    });
});
