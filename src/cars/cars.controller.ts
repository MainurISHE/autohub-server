import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CarsService } from './cars.service';
import { UpdateCarDto } from '../common/dto/update-car.dto';
import { CreateCarDto } from 'src/common/dto/create-car.dto';
import { GetCarsQueryDto } from 'src/common/dto/get-cars-query.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { User } from '@prisma/client';

@Controller('cars')
export class CarsController {
    constructor(
        private readonly carsService: CarsService,

    ) {}

    @Get()
    findAll(@Query() getCarsQueryDto: GetCarsQueryDto) {
        return this.carsService.findAll(getCarsQueryDto)
    }

    @Get("options")
    getOptions() {
        return this.carsService.getOptions()
    }

    @Get('my')
    @UseGuards(JwtAuthGuard)
    findMyCars(
        @CurrentUser() user: User,
    ) {
        return this.carsService.findMyCars(user.id)
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.carsService.findOne(id)
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(
        @Body() createCarDto: CreateCarDto,
        @CurrentUser() user: User,
    ) {
        return this.carsService.create(createCarDto, user.id)
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCarDto: UpdateCarDto,
        @CurrentUser() user: User,
    ) {
        return this.carsService.update(id, updateCarDto, user)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: User,
    ) {
        return this.carsService.remove(id, user)
    }
}
