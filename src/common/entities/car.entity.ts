import { CarBodyType } from "../enums/car-body-type.enum";
import { CarFuelType } from "../enums/car-fuel-type.enum";
import { CarTransmission } from "../enums/car-transmission.enum";
import { CarColor } from "../enums/car-color.enum";
import { CarStatus } from "../enums/car-status.enum";
import { CarDriveType } from "../enums/car-drive-type.enum";

export interface Car {
  id: number;
  title: string;
  description: string;
  price: number;

  year: number;
  mileage: number;
  engineVolume: number;
  horsepower: number;

  fuelType: CarFuelType;
  transmission: CarTransmission;
  driveType: CarDriveType;
  bodyType: CarBodyType;
  color: CarColor;
  status: CarStatus;

  brandId: number;

  createdAt: Date;
  updatedAt: Date;
}