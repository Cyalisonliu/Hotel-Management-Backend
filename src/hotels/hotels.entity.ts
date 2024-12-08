import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('hotel')
export class Hotel {
    @PrimaryGeneratedColumn()
    @IsNotEmpty()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    @IsNotEmpty()
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    webLink: string;

    @Column({ type: 'varchar', length: 255 })
    @IsNotEmpty()
    address: string;

    @Column({ type: 'varchar', length: 255 })
    @IsNotEmpty()
    email: string;

    @Column({ type: 'tinyint', width: 1 })
    @IsNotEmpty()
    status: number;

    @Column({ type: 'varchar', length: 50 })
    @IsNotEmpty()
    coordinate: string;
}
