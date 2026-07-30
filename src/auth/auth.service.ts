import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { UsersService } from 'src/users/users.service';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/auth/dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserMapper } from 'src/users/mappers/user.mapper';
import { AccessTokenPayload } from './interfaces/access-token-payload.interface';
import { RefreshTokenPayload } from './interfaces/refresh-token-payload.interface';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly userMapper: UserMapper,
    private readonly configService: ConfigService,
  ) {}

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

    return this.userMapper.toResponseDto(createdUser);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.issueTokens(user);
  }

  private async issueTokens(user: User) {
    const accessPayload: AccessTokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const refreshPayload: RefreshTokenPayload = {
      sub: user.id,
    };

    const accessToken = await this.generateAccessToken(accessPayload);
    const refreshToken = await this.generateRefreshToken(refreshPayload);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.usersService.saveRefreshToken(user.id, hashedRefreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async generateAccessToken(
    payload: AccessTokenPayload,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.getOrThrow<StringValue>(
        'JWT_ACCESS_EXPIRES_IN',
      ),
    });
  }

  private async generateRefreshToken(
    payload: RefreshTokenPayload,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.getOrThrow<StringValue>(
        'JWT_REFRESH_EXPIRES_IN',
      ),
    });
  }

  async refresh(user: User, refreshToken: string) {
    if (!user.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isValid = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.issueTokens(user);
  }

  async logout(userId: number) {
    await this.usersService.removeRefreshToken(userId);
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const user = await this.usersService.findByIdWithPassword(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Current is password incorrect');
    }

    const isSamePassword = await bcrypt.compare(
      changePasswordDto.newPassword,
      user.password,
    );

    if (isSamePassword) {
      throw new BadRequestException(
        'New password must be different from the current password',
      );
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

    await this.usersService.updatePassword(user.id, hashedPassword);

    await this.usersService.removeRefreshToken(user.id);

    return {
      message: 'Password changed successfully',
    };
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    const user = await this.usersService.findByIdWithPassword(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (updateProfileDto.email) {
      const existingUser = await this.usersService.findByEmail(
        updateProfileDto.email,
      );

      if (existingUser && existingUser.id !== user.id) {
        throw new ConflictException('Email is alredy in use');
      }
    }

    return this.usersService.updateProfile(user.id, updateProfileDto);
  }
}
