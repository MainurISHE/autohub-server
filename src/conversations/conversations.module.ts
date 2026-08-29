import { Module } from '@nestjs/common';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ConversationsController],
  providers: [ConversationsService],
  imports: [PrismaModule]
})
export class ConversationsModule {}
