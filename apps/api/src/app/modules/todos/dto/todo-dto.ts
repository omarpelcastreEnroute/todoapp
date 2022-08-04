import { Type } from "class-transformer";
import { IsDate, IsEmail, isNotEmpty, IsNotEmpty, IsObject, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class TodoDto{

    @IsNotEmpty()
    @IsString()
    @MinLength(10)
    @MaxLength(120)
    title: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(100)
    @MaxLength(1000)
    description: string;

    @IsNotEmpty()
    @IsString()
    status: string;
}