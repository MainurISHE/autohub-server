import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Injectable()
export class ConversationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: number) {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        OR: [
          {
            user1Id: userId,
          },
          {
            user2Id: userId,
          },
        ],
      },

      include: {
        user1: {
          select: {
            id: true,
            name: true,
            lastName: true,
            avatarUrl: true,
          },
        },

        user2: {
          select: {
            id: true,
            name: true,
            lastName: true,
            avatarUrl: true,
          },
        },

        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          select: {
            id: true,
            content: true,
            senderId: true,
            createdAt: true,
          },
        },

        _count: {
          select: {
            messages: {
              where: {
                senderId: {
                  not: userId,
                },
                readAt: null,
              },
            },
          },
        },
      },

      orderBy: {
        updatedAt: 'desc',
      },
    });

    return conversations.map((conversation) => ({
      ...conversation,

      unreadCount: conversation._count.messages,
    }));
  }

  async create(userId: number, createConversationDto: CreateConversationDto) {
    const { receiverId } = createConversationDto;

    const conversation = await this.prisma.conversation.findFirst({
      where: {
        OR: [
          {
            user1Id: userId,
            user2Id: receiverId,
          },
          {
            user1Id: receiverId,
            user2Id: userId,
          },
        ],
      },
    });

    if (conversation) {
      return conversation;
    }

    return this.prisma.conversation.create({
      data: {
        user1Id: userId,
        user2Id: receiverId,
      },
    });
  }
}
