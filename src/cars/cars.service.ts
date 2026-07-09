import { Injectable, NotFoundException } from '@nestjs/common';
import { Car } from '../common/entities/car.entity';
import { CreateCarDto } from '../common/dto/create-car.dto';
import { UpdateCarDto } from '../common/dto/update-car.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CarsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.car.findMany();
  }

  async findOne(id: number) {
    const car = await this.prisma.car.findUnique({
      where: { id },
    });

    if (!car) {
      throw new NotFoundException('Car is not found');
    }

    return car;
  }

  create(createCarDto: CreateCarDto) {
    return this.prisma.car.create({
      data: createCarDto,
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
