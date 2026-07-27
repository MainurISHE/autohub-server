import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from 'src/auth/dto/login.dto';
import { UserMapper } from 'src/users/mappers/user.mapper';
import { RefreshJwtAuthGuard } from './guards/jwt-refresh-auth.guard';
import type { RefreshRequest } from './interfaces/refresh-request.interface';
import type { Response } from 'express';
import type { AuthRequest } from './interfaces/auth-request.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userMapper: UserMapper,
  ) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.login(loginDto);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      accessToken: tokens.accessToken,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.userMapper.toResponseDto(req.user);
  }

  @Post('refresh')
  @UseGuards(RefreshJwtAuthGuard)
  refresh(@Req() req: RefreshRequest) {
    const { user, refreshToken } = req.user;

    return this.authService.refresh(user, refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @Req() req: AuthRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.clearCookie('refreshToken');

    await this.authService.logout(req.user.id);

    return {
      message: 'Logged out successfully',
    };
  }
}
