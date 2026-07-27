import type { Request } from 'express';
import type { User } from '@prisma/client';

export interface AuthRequest extends Request {
  user: User;
}