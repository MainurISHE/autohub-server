import { Injectable } from '@nestjs/common';
import { RegisterDto } from 'src/common/dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async create(registerDto: RegisterDto, hashedPassword: string) {
    const { password, ...userData } = registerDto
    return this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
  }
}
