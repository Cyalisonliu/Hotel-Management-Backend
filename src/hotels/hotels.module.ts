import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from './hotels.entity';
import { HotelsController } from './hotels.controller';
import { HotelsService } from './hotels.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([Hotel]),
    MulterModule.register({
      dest: './uploads', // Define the upload directory
    }),
  ],
  controllers: [HotelsController],
  providers: [HotelsService],
})
export class HotelsModule {}
