import { Module } from '@nestjs/common';
import { BrandsController } from './brands.controller';
import { BrandsService } from './brands.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [BrandsController],
  providers: [BrandsService],
  imports: [PrismaModule],
  exports: [BrandsService],
})
export class BrandsModule {}
