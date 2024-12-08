import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from './hotels/hotels.entity';
import { HotelsModule } from './hotels/hotels.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      username: process.env.DB_USER || 'appuser',
      password: process.env.DB_PASSWORD || 'appuserpassword',
      database: process.env.DB_NAME || 'line_travel',
      entities: [Hotel],
      synchronize: true,
    }),
    HotelsModule,
  ],
  controllers: [],
})
export class AppModule {}
