import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [FavoritesService],
  controllers: [FavoritesController],
  imports: [PrismaModule],
})
export class FavoritesModule {}
