import { Type } from "class-transformer";
import { IsDate, IsEmail, isNotEmpty, IsNotEmpty, IsObject, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { TodoDto } from "./todo-dto";

export class UpdateTodoDto{

    @IsNotEmpty()
    @IsString()
    id: string;

    @IsNotEmpty()
    todo: TodoDto
}