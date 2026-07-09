-- CreateEnum
CREATE TYPE "CarBodyType" AS ENUM ('SEDAN', 'SUV', 'HATCHBACK', 'COUPE', 'WAGON', 'PICKUP');

-- CreateEnum
CREATE TYPE "CarColor" AS ENUM ('BLACK', 'WHITE', 'SILVER', 'RED', 'BLUE', 'GREEN', 'GRAY');

-- CreateEnum
CREATE TYPE "CarDriveType" AS ENUM ('FWD', 'RWD', 'AWD');

-- CreateEnum
CREATE TYPE "CarFuelType" AS ENUM ('PETROL', 'DIESEL', 'HYBRID', 'ELECTRIC');

-- CreateEnum
CREATE TYPE "CarStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'SOLD');

-- CreateEnum
CREATE TYPE "CarTransmission" AS ENUM ('MANUAL', 'AUTOMATIC', 'CVT', 'ROBOT');

-- CreateTable
CREATE TABLE "Brand" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Car" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "year" INTEGER NOT NULL,
    "mileage" INTEGER NOT NULL,
    "engineVolume" INTEGER NOT NULL,
    "horsepower" INTEGER NOT NULL,
    "fuelType" "CarFuelType" NOT NULL,
    "transmission" "CarTransmission" NOT NULL,
    "driveType" "CarDriveType" NOT NULL,
    "bodyType" "CarBodyType" NOT NULL,
    "color" "CarColor" NOT NULL,
    "status" "CarStatus" NOT NULL,
    "brandId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
