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
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly userMapper: UserMapper,
    private readonly configService: ConfigService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private static readonly SALT_ROUNDS = 10;

  private async validatePassword(plain: string, hash: string) {
    return bcrypt.compare(plain, hash);
  }

  private async getUserOrThrow(userId: number) {
    const user = await this.usersService.findByIdWithPassword(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  private async getUserWithAvatarOrThrow(userId: number) {
    const user = await this.usersService.findByIdWithAvatar(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  private async deleteAvatar(publicId?: string | null) {
    if (!publicId) return;

    await this.cloudinaryService.destroy(publicId);
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

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.findByEmail(registerDto.email);

    if (user) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(
      registerDto.password,
      AuthService.SALT_ROUNDS,
    );

    const createdUser = await this.usersService.create(
      registerDto,
      hashedPassword,
    );

    const tokens = await this.issueTokens(createdUser)

    return tokens;
  }

  async login(loginDto: LoginDto) {
    console.log('1. Login request:', loginDto);

    const user = await this.usersService.findByEmail(loginDto.email);

    console.log('2. User:', user);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await this.validatePassword(
      loginDto.password,
      user.password,
    );

    console.log('3. Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    console.log('4. Issuing tokens');

    return this.issueTokens(user);
  }

  private async issueAccessToken(user: User): Promise<string> {
    const accessPayload: AccessTokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.generateAccessToken(accessPayload);
  }

  private async issueTokens(user: User) {
    const accessToken = await this.issueAccessToken(user);

    const refreshPayload: RefreshTokenPayload = {
      sub: user.id,
    };

    const refreshToken = await this.generateRefreshToken(refreshPayload);

    const hashedRefreshToken = await bcrypt.hash(
      refreshToken,
      AuthService.SALT_ROUNDS,
    );

    await this.usersService.saveRefreshToken(user.id, hashedRefreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(user: User, refreshToken: string) {
    if (!user.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isValid = await this.validatePassword(
      refreshToken,
      user.refreshToken,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const accessToken = await this.issueAccessToken(user);

    return {
      accessToken
    }
  }

  async logout(userId: number) {
    await this.usersService.removeRefreshToken(userId);
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const user = await this.getUserOrThrow(userId);

    const isPasswordValid = await this.validatePassword(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const isSamePassword = await this.validatePassword(
      changePasswordDto.newPassword,
      user.password,
    );

    if (isSamePassword) {
      throw new BadRequestException(
        'New password must be different from the current password',
      );
    }

    const hashedPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      AuthService.SALT_ROUNDS,
    );

    await this.usersService.updatePassword(user.id, hashedPassword);

    await this.usersService.removeRefreshToken(user.id);

    return {
      message: 'Password changed successfully',
    };
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    const user = await this.getUserOrThrow(userId);

    if (updateProfileDto.email) {
      const existingUser = await this.usersService.findByEmail(
        updateProfileDto.email,
      );

      if (existingUser && existingUser.id !== user.id) {
        throw new ConflictException('Email is already in use');
      }
    }

    return this.usersService.updateProfile(user.id, updateProfileDto);
  }

  async changeAvatar(userId: number, image: Express.Multer.File) {
    const user = await this.getUserWithAvatarOrThrow(userId);

    await this.deleteAvatar(user.avatarPublicId);

    const uploadedImage = await this.cloudinaryService.uploadImage(image);

    await this.usersService.updateAvatar(
      user.id,
      uploadedImage.url,
      uploadedImage.publicId,
    );

    return this.usersService.findById(user.id);
  }

  async removeAvatar(userId: number) {
    const user = await this.getUserWithAvatarOrThrow(userId);

    if (!user.avatarPublicId) {
      throw new BadRequestException('User does not have an avatar');
    }

    await this.deleteAvatar(user.avatarPublicId);

    await this.usersService.removeAvatar(user.id);

    return this.usersService.findById(user.id);
  }
}
