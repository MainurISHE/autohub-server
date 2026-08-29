export class UserResponseDto {
  id!: number;
  name!: string;
  lastName!: string;
  email!: string;
  phoneNumber!: string | null;
  avatarUrl!: string | null;
  role!: string;
  createdAt!: Date;
  updatedAt!: Date;
}
