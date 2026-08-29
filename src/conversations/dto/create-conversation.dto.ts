import { IsInt } from "class-validator";

export class CreateConversationDto {
  @IsInt()
  receiverId!: number;
}