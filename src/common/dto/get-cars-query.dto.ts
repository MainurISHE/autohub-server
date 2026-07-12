import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { CarBodyType } from '../enums/car-body-type.enum';
import { CarColor } from '../enums/car-color.enum';
import { CarDriveType } from '../enums/car-drive-type.enum';
import { CarFuelType } from '../enums/car-fuel-type.enum';
import { CarStatus } from '../enums/car-status.enum';
import { CarTransmission } from '../enums/car-transmission.enum';
import { CarSortField } from '../enums/car-sort-field.enum';
import { SortOrder } from '../enums/sort-order.enum';
import { Type } from 'class-transformer';

export class GetCarsQueryDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  brandId?: number;

  @IsOptional()
  @IsEnum(CarStatus)
  status?: CarStatus;

  @IsOptional()
  @IsEnum(CarFuelType)
  fuelType?: CarFuelType;

  @IsOptional()
  @IsEnum(CarBodyType)
  bodyType?: CarBodyType;

  @IsOptional()
  @IsEnum(CarDriveType)
  driveType?: CarDriveType;

  @IsOptional()
  @IsEnum(CarTransmission)
  transmission?: CarTransmission;

  @IsOptional()
  @IsEnum(CarColor)
  color?: CarColor;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxPrice?: number;

  @IsOptional()
  @IsEnum(CarSortField)
  sortBy?: CarSortField;

  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number

  @IsOptional()
  @IsString()
  search?: string
}
