import { IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { Status, VALIDATIONS } from '@nxreact/data'
export class TodoDto{

    @IsNotEmpty()
    @IsString()
    @MinLength(VALIDATIONS.TITLE.min)
    @MaxLength(VALIDATIONS.TITLE.min)
    title: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(VALIDATIONS.DESCRIPTION.min)
    @MaxLength(VALIDATIONS.DESCRIPTION.max)
    description: string;

    @IsNotEmpty()
    @IsEnum(Status)
    status: Status;
}