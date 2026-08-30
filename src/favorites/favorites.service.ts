import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async addToFavorites(userId: number, carId: number) {
    const car = await this.prisma.car.findUnique({
      where: { id: carId },
    });

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_carId: {
          userId,
          carId,
        },
      },
    });

    if (favorite) {
      throw new ConflictException('Car is already in favorites');
    }

    return this.prisma.favorite.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },

        car: {
          connect: {
            id: carId,
          },
        },
      },
    });
  }

  async removeFromFavorites(userId: number, carId: number) {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_carId: {
          userId,
          carId,
        },
      },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    await this.prisma.favorite.delete({
      where: {
        id: favorite.id,
      },
    });

    return {
      message: 'Car removed from favorites',
    };
  }

  async findAllFavorites(userId: number) {
    const favorites = await this.prisma.favorite.findMany({
      where: {
        userId,
      },

      include: {
        car: {
          include: {
            brand: true,
            images: {
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return favorites.map((favorites) => favorites.car);
  }
}
