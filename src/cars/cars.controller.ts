import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { CarsService } from './cars.service';
import { UpdateCarDto } from '../common/dto/update-car.dto';
import { CreateCarDto } from 'src/common/dto/create-car.dto';
import { GetCarsQueryDto } from 'src/common/dto/get-cars-query.dto';

@Controller('cars')
export class CarsController {
    constructor(private readonly carsService: CarsService) {}

    @Get()
    findAll(@Query() getCarsQueryDto: GetCarsQueryDto) {
        return this.carsService.findAll(getCarsQueryDto)
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.carsService.findOne(id)
    }

    @Post()
    create(@Body() createCarDto: CreateCarDto) {
        return this.carsService.create(createCarDto)
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCarDto: UpdateCarDto
    ) {
        return this.carsService.update(id, updateCarDto)
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.carsService.remove(id)
    }
}
