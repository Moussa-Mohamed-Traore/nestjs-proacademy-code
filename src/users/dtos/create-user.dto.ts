import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from "class-validator";
import { CreateProfileDto } from "src/profile/dtos/create-profile";

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  email: string;

  @IsNotEmpty()
  @MaxLength(24)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(100)
  password: string; 

  @IsOptional()
  profile: CreateProfileDto | undefined;
}
