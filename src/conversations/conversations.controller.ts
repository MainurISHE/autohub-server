import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    const user = req.user;

    return this.conversationsService.findAll(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createConversationDto: CreateConversationDto, @Request() req) {
    const user = req.user;

    return this.conversationsService.create(user.id, createConversationDto);
  }
}
