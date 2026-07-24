import { Injectable } from '@nestjs/common';
import { RegisterDto } from 'src/common/dto/register.dto';
import { UsersService } from 'src/users/users.service';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(readonly usersService: UsersService) {}

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.findByEmail(registerDto.email);

    if (user) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const createdUser = await this.usersService.create(
      registerDto,
      hashedPassword,
    );

    const { password, ...result } = createdUser;

    return result
  }
}
