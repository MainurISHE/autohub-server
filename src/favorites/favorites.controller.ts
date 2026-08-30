import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import type { User } from '@prisma/client';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAllFavorites(@CurrentUser() user: User) {
    return this.favoritesService.findAllFavorites(user.id);
  }

  @Post(':carId')
  @UseGuards(JwtAuthGuard)
  addToFavorites(
    @Param('carId', ParseIntPipe) carId: number,
    @CurrentUser() user: User,
  ) {
    return this.favoritesService.addToFavorites(user.id, carId);
  }

  @Delete(':carId')
  @UseGuards(JwtAuthGuard)
  removeFromFavorites(
    @Param('carId', ParseIntPipe) carId: number,
    @CurrentUser() user: User,
  ) {
    return this.favoritesService.removeFromFavorites(user.id, carId);
  }
}