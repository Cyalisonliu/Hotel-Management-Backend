import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, IsNumber } from "class-validator";

export class CreateHotelDto {
    @ApiProperty({ description: '飯店名稱' })
    @IsString()
    @MaxLength(255)
    name: string;

    @ApiProperty({ description: '飯店網站連結' })
    @IsString()
    @MaxLength(255)
    webLink?: string;

    @ApiProperty({ description: '飯店地址' })
    @IsString()
    @MaxLength(100)
    address: string;

    @ApiProperty({ description: '飯店電子郵件' })
    @IsString()
    @MaxLength(255)
    email: string;

    @ApiProperty({ description: '飯店狀態' })
    @IsNumber()
    status: number;

    @ApiProperty({ description: '飯店座標' })
    @IsString()
    @MaxLength(50)
    coordinate: string;
}
