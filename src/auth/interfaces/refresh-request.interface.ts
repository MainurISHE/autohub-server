import { User } from "@prisma/client";

export interface RefreshRequest extends Request {
  user: {
    user: User;
    refreshToken: string;
  };
}