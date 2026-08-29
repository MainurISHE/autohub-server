import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(conversationId: number, userId: number) {
    const conversation = await this.prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const isParticipant =
      conversation.user1Id === userId || conversation.user2Id === userId;

    if (!isParticipant) {
      throw new ForbiddenException(
        'You are not a participant of this conversation',
      );
    }

    return this.prisma.message.findMany({
      where: {
        conversationId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async create(userId: number, createMessageDto: CreateMessageDto) {
    const { conversationId, content } = createMessageDto;

    const conversation = await this.prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const isParticipant =
      conversation.user1Id === userId || conversation.user2Id === userId;

    if (!isParticipant) {
      throw new ForbiddenException(
        'You are not a participant of this conversation',
      );
    }

    const [message] = await this.prisma.$transaction([
      this.prisma.message.create({
        data: {
          content,
          conversationId,
          senderId: userId,
        },
      }),

      this.prisma.conversation.update({
        where: {
          id: conversationId,
        },
        data: {
          updatedAt: new Date(),
        },
      }),
    ]);

    return message;
  }

  async markAsRead(conversationId: number, userId: number) {
    const conversation = await this.prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const isParticipant =
      conversation.user1Id === userId || conversation.user2Id === userId;

    if (!isParticipant) {
      throw new ForbiddenException(
        'You are not a participant of this conversation',
      );
    }

    await this.prisma.message.updateMany({
      where: {
        conversationId,
        senderId: {
          not: userId,
        },
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });

    return {
      message: 'Messages marked as read',
    };
  }
}
