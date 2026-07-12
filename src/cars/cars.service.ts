import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCarDto } from '../common/dto/create-car.dto';
import { UpdateCarDto } from '../common/dto/update-car.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetCarsQueryDto } from 'src/common/dto/get-cars-query.dto';
import { Prisma } from '@prisma/client';
import { SortOrder } from 'src/common/enums/sort-order.enum';

@Injectable()
export class CarsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(getCarsQueryDto: GetCarsQueryDto) {
    const where: Prisma.CarWhereInput = {};
    const price: Prisma.IntFilter = {};
    const orderBy: Prisma.CarOrderByWithRelationInput = {};
    const page = getCarsQueryDto.page ?? 1;
    const limit = getCarsQueryDto.limit ?? 10;

    const skip = (page - 1) * limit;

    if (getCarsQueryDto.sortBy) {
      const order = getCarsQueryDto.order ?? SortOrder.ASC;

      orderBy[getCarsQueryDto.sortBy] = order;
    }

    if (getCarsQueryDto.search) {
      where.title = {
        contains: getCarsQueryDto.search,
        mode: 'insensitive',
      };
    }

    if (getCarsQueryDto.minPrice != null) {
      price.gte = getCarsQueryDto.minPrice;
    }

    if (getCarsQueryDto.maxPrice) {
      price.lte = getCarsQueryDto.maxPrice;
    }

    if (Object.keys(price).length > 0) {
      where.price = price;
    }

    if (getCarsQueryDto.brandId) {
      where.brandId = getCarsQueryDto.brandId;
    }

    if (getCarsQueryDto.status) {
      where.status = getCarsQueryDto.status;
    }

    if (getCarsQueryDto.fuelType) {
      where.fuelType = getCarsQueryDto.fuelType;
    }

    if (getCarsQueryDto.bodyType) {
      where.bodyType = getCarsQueryDto.bodyType;
    }

    if (getCarsQueryDto.driveType) {
      where.driveType = getCarsQueryDto.driveType;
    }

    if (getCarsQueryDto.transmission) {
      where.transmission = getCarsQueryDto.transmission;
    }

    if (getCarsQueryDto.color) {
      where.color = getCarsQueryDto.color;
    }

    return this.prisma.car.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        brand: true,
      },
    });
  }

  async findOne(id: number) {
    const car = await this.prisma.car.findUnique({
      where: { id },
      include: { brand: true },
    });

    if (!car) {
      throw new NotFoundException('Car is not found');
    }

    return car;
  }

  create(createCarDto: CreateCarDto) {
    const { brandId, ...carData } = createCarDto;

    return this.prisma.car.create({
      data: {
        ...carData,

        brand: {
          connect: {
            id: brandId,
          },
        },
      },
    });
  }

  async update(id: number, updateCarDto: UpdateCarDto) {
    await this.findOne(id);

    return this.prisma.car.update({
      where: { id },
      data: updateCarDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.car.delete({
      where: { id },
    });
  }
}
