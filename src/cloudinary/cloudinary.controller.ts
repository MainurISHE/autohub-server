import {
  Body,
  Controller,
  Delete,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CloudinaryService } from './cloudinary.service';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  upload(@UploadedFile() image: Express.Multer.File) {
    return this.cloudinaryService.uploadImage(image);
  }

  @Delete(':publicId')
  remove(@Body('publicId') publicId: string) {
    return this.cloudinaryService.destroy(publicId);
  }
}
