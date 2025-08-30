import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { User } from "src/users/user.entity";

export class CreateTweetDto {
    @IsString()
    @IsNotEmpty()
    text: string;

    @IsOptional()
    @IsString()
    image?: string;
    
    @IsOptional()
    @IsInt({ each: true })
    @IsArray()
    hashtags?: number[];
}