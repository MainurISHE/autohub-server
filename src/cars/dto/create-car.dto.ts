import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { CarStatus } from '../enums/car-status.enum';
import { CarFuelType } from '../enums/car-fuel-type.enum';
import { CarColor } from '../enums/car-color.enum';
import { CarTransmission } from '../enums/car-transmission.enum';
import { CarDriveType } from '../enums/car-drive-type.enum';
import { CarBodyType } from '../enums/car-body-type.enum';

export class CreateCarDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1000)
  price!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1886)
  @Max(new Date().getFullYear() + 1)
  year!: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  mileage!: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  engineVolume!: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  horsepower!: number;

  @IsNotEmpty()
  @IsEnum(CarFuelType)
  fuelType!: CarFuelType;

  @IsNotEmpty()
  @IsEnum(CarTransmission)
  transmission!: CarTransmission;

  @IsNotEmpty()
  @IsEnum(CarDriveType)
  driveType!: CarDriveType;

  @IsNotEmpty()
  @IsEnum(CarBodyType)
  bodyType!: CarBodyType;

  @IsNotEmpty()
  @IsEnum(CarColor)
  color!: CarColor;

  @IsNotEmpty()
  @IsEnum(CarStatus)
  status!: CarStatus;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  brandId!: number;
}
