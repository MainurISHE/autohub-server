import { Injectable, NotFoundException } from '@nestjs/common';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserMapper } from './mappers/user.mapper';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from 'src/auth/dto/update-profile.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userMapper: UserMapper,
  ) {}

  private async findByIdOrThrow(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private updateUser(userId: number, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data,
    });
  }

  async findAll() {
    const users = await this.prisma.user.findMany();

    return this.userMapper.toResponseDtos(users);
  }

  async findPublicProfile(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        lastName: true,
        avatarUrl: true,
        createdAt: true,

        cars: {
          include: {
            brand: true,
            images: {
              orderBy: {
                order: 'asc',
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findById(id: number) {
    const user = await this.findByIdOrThrow(id);

    return this.userMapper.toResponseDto(user);
  }

  async findByIdWithRefreshToken(id: number) {
    return this.findByIdOrThrow(id);
  }

  async findByIdWithPassword(id: number) {
    return this.findByIdOrThrow(id);
  }

  async findByIdWithAvatar(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
        avatarUrl: true,
        avatarPublicId: true,
      },
    });
  }

  async create(registerDto: RegisterDto, hashedPassword: string) {
    const { password, ...userData } = registerDto;
    return this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findByIdOrThrow(id);

    const user = await this.updateUser(id, updateUserDto);

    return this.userMapper.toResponseDto(user);
  }

  async remove(id: number) {
    await this.findByIdOrThrow(id);

    const user = await this.prisma.user.delete({
      where: { id },
    });

    return this.userMapper.toResponseDto(user);
  }

  async saveRefreshToken(
    userId: number,
    hashedRefreshToken: string,
  ): Promise<void> {
    await this.updateUser(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async removeRefreshToken(userId: number): Promise<void> {
    await this.updateUser(userId, {
      refreshToken: null,
    });
  }

  async updatePassword(userId: number, password: string) {
    return this.updateUser(userId, {
      password,
    });
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: updateProfileDto,
      omit: {
        password: true,
        refreshToken: true,
      },
    });
  }

  async updateAvatar(
    userId: number,
    avatarUrl: string,
    avatarPublicId: string,
  ) {
    return this.updateUser(userId, {
      avatarUrl,
      avatarPublicId,
    });
  }

  async removeAvatar(userId: number) {
    return this.updateUser(userId, {
      avatarUrl: null,
      avatarPublicId: null,
    });
  }
}
