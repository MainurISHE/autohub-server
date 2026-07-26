import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserMapper } from './mappers/user.mapper';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserMapper],
  imports: [PrismaModule],
  exports: [UsersService, UserMapper],
})
export class UsersModule {}
