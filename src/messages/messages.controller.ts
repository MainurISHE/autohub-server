import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messageService: MessagesService) {}

  @Get(':conversationId')
  @UseGuards(JwtAuthGuard)
  findAll(
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @Request() req,
  ) {
    const user = req.user;

    return this.messageService.findAll(conversationId, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':conversationId/read')
  markAsRead(
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @Request() req,
  ) {
    return this.messageService.markAsRead(conversationId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createMessageDto: CreateMessageDto, @Request() req) {
    const user = req.user;

    return this.messageService.create(user.id, createMessageDto);
  }
}
