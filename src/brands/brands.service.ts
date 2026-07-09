import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from '../common/dto/create-brand.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateBrandDto } from 'src/common/dto/update-brand.dto';

@Injectable()
export class BrandsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.brand.findMany();
  }

  async findOne(id: number) {
    const brand = await this.prisma.brand.findUnique({
      where: {
        id,
      },
    });

    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    return brand;
  }

  create(createBrandDto: CreateBrandDto) {
    return this.prisma.brand.create({
      data: createBrandDto,
    });
  }

  async update(id: number, updateBrandDto: UpdateBrandDto) {
    await this.findOne(id);;

    return this.prisma.brand.update({
      where: {
        id,
      },
      data: updateBrandDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.brand.delete({
      where: { id },
    });
  }
}
