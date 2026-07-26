import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class UserMapper {
  toResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  toResponseDtos(users: User[]): UserResponseDto[] {
    return users.map((user) => this.toResponseDto(user));
  }
}
