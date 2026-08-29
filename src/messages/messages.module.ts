import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MessagesGateway } from './messages.gateway';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService, MessagesGateway],
  imports: [PrismaModule, JwtModule]
})
export class MessagesModule {}
