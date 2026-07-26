export class UserResponseDto {
  id!: number;
  name!: string;
  lastName!: string;
  email!: string;
  phoneNumber!: null | string;
  role!: string;
  createdAt!: Date;
  updatedAt!: Date;
}
