import { 
    Controller, 
    Post, 
    Get, 
    Body, 
    UploadedFile, 
    UseInterceptors, 
    BadRequestException,
    HttpStatus,
    Param,
    Patch,
} from '@nestjs/common';
import { 
    ApiOperation, 
    ApiParam, 
    ApiResponse, 
    ApiBody, 
    ApiConsumes 
} from '@nestjs/swagger';
import { HotelsService } from './hotels.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { HotelIdResponseDto, HotelIdsResponseDto, HotelResponseDto, HotelsResponseDto } from './dto/hotel.response.dto';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';

@Controller('hotels')
export class HotelsController {
    constructor(private readonly hotelsService: HotelsService) {}

    @ApiOperation({ summary: '上傳 CSV 檔案批次匯入飯店資訊' })
    @ApiBody({
        description: 'CSV file containing hotel information',
        required: true,
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'CSV file to upload'
                }
            }
        }
    })
    @ApiResponse({ 
        status: HttpStatus.CREATED, 
        description: 'CSV file uploaded successfully, returns array of created hotel IDs',
        type: HotelIdsResponseDto
    })
    @ApiResponse({ 
        status: HttpStatus.BAD_REQUEST, 
        description: 'No file uploaded | CSV file missing required fields | CSV file is empty | Hotel already exists' 
    })
    @ApiResponse({ 
        status: HttpStatus.INTERNAL_SERVER_ERROR, 
        description: 'Failed to process CSV file' 
    })
    @ApiConsumes('multipart/form-data')
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', { dest: './uploads' }))
    async uploadFile(@UploadedFile() file): Promise<HotelIdsResponseDto> {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }
        
        const hotelIds = await this.hotelsService.addHotelFromCsv(file.path);
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Hotels uploaded successfully',
            data: hotelIds,
        };
    }

    @ApiOperation({ summary: '新增飯店' })
    @ApiBody({
        type: CreateHotelDto,
        description: 'Information of the hotel to be added',
        examples: {
            hotel1: {
                summary: 'Complete hotel information',
                value: {
                    name: '台北萬豪酒店',
                    webLink: 'https://www.taipeimarriott.com.tw',
                    address: '台北市中山區樂群二路199號',
                    email: 'marriott@taipeimarriott.com',
                    status: 1,
                    coordinate: '121.555,25.081'
                }
            },
            hotel2: {
                summary: 'Hotel with only required fields',
                value: {
                    name: '台北君悅酒店',
                    address: '台北市信義區松壽路2號',
                    email: 'taipei@hyatt.com',
                    status: 0,
                    coordinate: '121.561,25.085'
                }
            }
        }
    })
    @ApiResponse({ 
        status: HttpStatus.CREATED, 
        description: 'Hotel added successfully, returns the created hotel ID',
        type: HotelIdResponseDto
    })
    @ApiResponse({ 
        status: HttpStatus.BAD_REQUEST, 
        description: 'Hotel data is required | Missing required fields | Hotel already exists' 
    })
    @ApiResponse({ 
        status: HttpStatus.INTERNAL_SERVER_ERROR, 
        description: 'Failed to add hotel' 
    })
    @Post()
    async addHotel(@Body() createHotelDto: CreateHotelDto): Promise<HotelIdResponseDto> {
        const hotelId = await this.hotelsService.addHotel(createHotelDto);
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Hotel added successfully',
            data: hotelId,
        };
    }

    @ApiOperation({ summary: '取得所有飯店資訊' })
    @ApiResponse({ 
        status: HttpStatus.OK, 
        description: 'Hotels retrieved successfully',
        type: HotelsResponseDto
    })
    @ApiResponse({ 
        status: HttpStatus.INTERNAL_SERVER_ERROR, 
        description: 'Failed to retrieve hotels' 
    })
    @Get()
    async getHotels(): Promise<HotelsResponseDto> {
        const hotels = await this.hotelsService.getHotels();
        return {
            statusCode: HttpStatus.OK,
            message: 'Hotels retrieved successfully',
            data: hotels,
        };
    }

    @ApiOperation({ summary: '取得單一飯店資訊' })
    @ApiParam({ 
        name: 'id', 
        type: 'number', 
        description: 'hotel ID',
        required: true,
        example: 1
    })
    @ApiResponse({ 
        status: HttpStatus.OK, 
        description: 'Hotel retrieved successfully',
        type: HotelResponseDto
    })
    @ApiResponse({ 
        status: HttpStatus.NOT_FOUND, 
        description: 'Hotel not found' 
    })
    @ApiResponse({ 
        status: HttpStatus.BAD_REQUEST, 
        description: 'Hotel ID is required | Invalid hotel ID' 
    })
    @ApiResponse({ 
        status: HttpStatus.INTERNAL_SERVER_ERROR, 
        description: 'Failed to retrieve hotel' 
    })
    @Get(':id')
    async getHotel(@Param('id') id: number): Promise<HotelResponseDto> {
        const hotel = await this.hotelsService.getHotel(id);
        return {
            statusCode: HttpStatus.OK,
            message: 'Hotel retrieved successfully',
            data: hotel,
        };
    }

    @ApiOperation({ summary: '修改飯店' })
    @ApiParam({ 
        name: 'id', 
        type: 'number', 
        description: 'hotel ID',
        required: true,
        example: 1
    })
    @ApiBody({
        type: UpdateHotelDto,
        description: 'Information of the hotel to be updated',
        examples: {
            hotel: {
                summary: 'hotel information to be updated',
                value: {
                    name: '松山意舍酒店',
                    address: '台北市松山區民生東路四段100號',
                }
            }
        }
    })
    @ApiResponse({ 
        status: HttpStatus.OK, 
        description: 'Hotel updated successfully',
        type: HotelResponseDto
    })
    @ApiResponse({ 
        status: HttpStatus.BAD_REQUEST, 
        description: 'Hotel ID is required' 
    })
    @ApiResponse({ 
        status: HttpStatus.NOT_FOUND, 
        description: 'Hotel not found' 
    })
    @ApiResponse({ 
        status: HttpStatus.INTERNAL_SERVER_ERROR, 
        description: 'Failed to update hotel' 
    })
    @Patch(':id')
    async updateHotel(@Param('id') id: number, @Body() updateHotelDto: UpdateHotelDto): Promise<HotelResponseDto> {
        const hotel = await this.hotelsService.updateHotel(id, updateHotelDto);
        return {
            statusCode: HttpStatus.OK,
            message: 'Hotel updated successfully',
            data: hotel,
        };
    }
}
