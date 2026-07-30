import { IsInt, IsNotEmpty, IsString, Min } from "class-validator"

export class CreateCarImageDto {
    @IsString()
    @IsNotEmpty()
    url!: string

    @IsString()
    @IsNotEmpty()
    publicId!: string

    @IsInt()
    @Min(0)
    order!: number
}
