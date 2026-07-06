import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';

@Injectable()
export class BrandsService {
  private nextId = 1;
  private brands = [
    {
      id: 1,
      name: 'BMW',
      country: 'Germany',
    },
    {
      id: 2,
      name: 'Audi',
      country: 'Germany',
    },
    {
      id: 3,
      name: 'Mercedes-Benz',
      country: 'Germany',
    },
  ];

  findAll() {
    return this.brands;
  }

  findOne(id: number) {
    const brand = this.findAll().find((brand) => brand.id === id);

    if (!brand) {
      throw new NotFoundException('Brand is not found');
    }

    return brand;
  }

  create(createBrandDto: CreateBrandDto) {
    const id = this.nextId++;

    const brand = {
      id,
      ...createBrandDto,
    };

    this.brands.push(brand);

    return brand;
  }
}
