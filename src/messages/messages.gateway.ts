import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';

import { PrismaService } from 'src/prisma/prisma.service';
import { MessagesService } from './messages.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class MessagesGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly messagesService: MessagesService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.auth?.token;

    if (!token) {
      console.log('WebSocket: no token');
      client.disconnect();
      return;
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      });

      console.log('WebSocket user:', payload);

      client.data.userId = payload.sub;

      const conversations = await this.prisma.conversation.findMany({
        where: {
          OR: [
            {
              user1Id: payload.sub,
            },
            {
              user2Id: payload.sub,
            },
          ],
        },
        select: {
          id: true,
        },
      });

      for (const conversation of conversations) {
        client.join(`conversation:${conversation.id}`);
      }

      console.log('User joined rooms:', Array.from(client.rooms));
    } catch (error) {
      console.error('WebSocket authentication error:', error);
      client.disconnect();
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody()
    data: {
      conversationId: number;
      content: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.userId;

    if (!userId) {
      client.disconnect();
      return;
    }

    const message = await this.messagesService.create(userId, {
      conversationId: data.conversationId,
      content: data.content,
    });

    this.server
      .to(`conversation:${data.conversationId}`)
      .emit('message', message);
  }
}