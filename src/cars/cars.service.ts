import { Injectable, NotFoundException } from '@nestjs/common';
import { Car } from './entities/car.entity';
import { CreateCarDto } from './dto/create-car.dto';

@Injectable()
export class CarsService {
  private cars: Car[] = [];
  private nextId = 1;

  findAll() {
    return this.cars;
  }

  findOne(id: number) {
    const car = this.findAll().find((car) => car.id === id);

    if (!car) {
      throw new NotFoundException('Car is not found');
    }

    return car;
  }

  create(createCarDto: CreateCarDto) {
    const id = this.nextId++;

    const car: Car = {
      id,
      ...createCarDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.cars.push(car);

    return car;
  }
}
