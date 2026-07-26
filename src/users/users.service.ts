import { Injectable, NotFoundException } from '@nestjs/common';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserMapper } from './mappers/user.mapper';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userMapper: UserMapper,
  ) {}

  async findAll() {
    const users = await this.prisma.user.findMany();

    return this.userMapper.toResponseDtos(users);
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.userMapper.toResponseDto(user)
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
    await this.findById(id);

    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    return this.userMapper.toResponseDto(user);
  }

  async remove(id: number) {
    await this.findById(id);

    const user = await this.prisma.user.delete({
      where: {id}
    })

    return this.userMapper.toResponseDto(user)
  }
}
