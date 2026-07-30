import { Module } from '@nestjs/common';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BrandsModule } from 'src/brands/brands.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  controllers: [CarsController],
  providers: [CarsService],
  imports: [PrismaModule, BrandsModule, CloudinaryModule],
})
export class CarsModule {}
