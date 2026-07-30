import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { MulterModule } from '@nestjs/platform-express';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [MulterModule.register(), CloudinaryModule],
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UploadsModule {}
