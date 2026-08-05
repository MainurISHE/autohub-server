import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCarDto } from '../common/dto/create-car.dto';
import { UpdateCarDto } from '../common/dto/update-car.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetCarsQueryDto } from 'src/common/dto/get-cars-query.dto';
import { Prisma, Role, User } from '@prisma/client';
import { SortOrder } from 'src/common/enums/sort-order.enum';
import { BrandsService } from 'src/brands/brands.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class CarsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly brandsService: BrandsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAll(getCarsQueryDto: GetCarsQueryDto) {
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

    if (getCarsQueryDto.maxPrice != null) {
      price.lte = getCarsQueryDto.maxPrice;
    }

    if (Object.keys(price).length > 0) {
      where.price = price;
    }

    if (getCarsQueryDto.brandId != null) {
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

    const total = await this.prisma.car.count({
      where,
    });

    const totalPages = Math.ceil(total / limit);

    const cars = await this.prisma.car.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        brand: true,
        images: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data: cars,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }

  async findOne(id: number) {
    const car = await this.prisma.car.findUnique({
      where: { id },
      include: { brand: true, images: { orderBy: { order: 'asc' } } },
    });

    if (!car) {
      throw new NotFoundException('Car is not found');
    }

    return car;
  }

  async findMyCars(userId: number) {
    return this.prisma.car.findMany({
      where: {
        ownerId: userId,
      },

      include: {
        brand: true,
        images: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
  }

  create(createCarDto: CreateCarDto, ownerId: number) {
    const { brandId, images, ...carData } = createCarDto;

    return this.prisma.car.create({
      data: {
        ...carData,

        brand: {
          connect: {
            id: brandId,
          },
        },

        owner: {
          connect: {
            id: ownerId,
          },
        },

        ...(images && {
          images: {
            create: images,
          },
        }),
      },
    });
  }

  async update(id: number, updateCarDto: UpdateCarDto, user: User) {
    await this.validateCarOwnership(id, user);

    const { brandId, images, ...carData } = updateCarDto;

    if (brandId != null) {
      await this.brandsService.findOne(brandId);

      return this.prisma.car.update({
        where: { id },
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

    return this.prisma.car.update({
      where: { id },
      data: carData,
    });
  }

  async remove(id: number, user: User) {
    const car = await this.validateCarOwnership(id, user);

    for (const image of car.images) {
      await this.cloudinaryService.destroy(image.publicId);
    }

    return this.prisma.car.delete({
      where: { id },
    });
  }

  private async validateCarOwnership(carId: number, user: User) {
    const car = await this.findOne(carId);

    if (user.role === Role.ADMIN) {
      return car;
    }

    if (car.ownerId !== user.id) {
      throw new ForbiddenException(
        'You do not have permission to modify this car',
      );
    }

    return car;
  }
}
