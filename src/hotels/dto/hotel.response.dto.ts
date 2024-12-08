import { ApiProperty } from '@nestjs/swagger';
import { HotelDto } from './hotel.dto';

export class ResponseDto<T> {
    @ApiProperty({
        description: 'HTTP status code',
        example: 200,
        type: Number
    })
    statusCode: number;

    @ApiProperty({
        description: 'Response message',
        example: 'Request successful',
        type: String
    })
    message: string;

    data?: T;
}

export class HotelIdResponseDto extends ResponseDto<number> {
    @ApiProperty({
        description: 'ID of the created hotel',
        type: Number,
        required: false,
        example: 1
    })
    data: number;
}

export class HotelIdsResponseDto extends ResponseDto<number[]> {
    @ApiProperty({
        description: 'List of hotel IDs',
        type: [Number],
        required: false,
        example: [1, 2, 3]
    })
    data: number[];
}

export class HotelResponseDto extends ResponseDto<HotelDto> {
    @ApiProperty({
        description: 'Hotel information',
        type: HotelDto,
        required: false,
        example: {
            name: '台北萬豪酒店',
            webLink: 'https://www.taipeimarriott.com.tw',
            address: '台北市信義區樂群二路199號',
            email: 'marriott@taipeimarriott.com',
            status: 1,
            coordinate: '120.332,25.252'
        }
    })
    data: HotelDto;
}

export class HotelsResponseDto extends ResponseDto<HotelDto[]> {
    @ApiProperty({
        description: 'List of hotel information',
        type: [HotelDto],
        required: false,
        example: [
            {
                name: '台北萬豪酒店',
                webLink: 'https://www.taipeimarriott.com.tw',
                address: '台北市信義區樂群二路199號',
                email: 'marriott@taipeimarriott.com',
                status: 1,
                coordinate: '120.332,25.252'
            },
            {
                name: '礁溪老爺酒店',
                webLink: 'https://www.hotelroyal.com.tw',
                address: '五峰路69號',
                email: 'hotelroyal@hotelroyal.com',
                status: 1,
                coordinate: '121.776,24.671'
            }
        ]
    })
    data: HotelDto[];
}