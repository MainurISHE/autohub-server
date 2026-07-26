import { Role } from '@prisma/client';

export interface AccessTokenPayload {
  sub: number;
  email: string;
  role: Role;
}
