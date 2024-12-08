import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";
import { CreateHotelDto } from "./create-hotel.dto";

export class HotelDto extends CreateHotelDto {
    @ApiProperty({ description: '飯店 ID' })    
    @IsNumber()
    id?: number;
}
