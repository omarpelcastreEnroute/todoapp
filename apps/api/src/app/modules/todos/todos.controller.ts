import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { Todo } from '@nxreact/data';
import { TodoDto } from './dto/todo-dto';
import { UpdateTodoDto } from './dto/updateTodo-dto';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {

    constructor(
        private todoService: TodosService
    ){}

    @Post()
    createUser(@Body() todo: TodoDto){
        return this.todoService.createTodo(todo)
    }



   @Get()
    getTodos(){
        return this.todoService.getTodos()
    }

    @Put()
    updateTodo(@Body() todo: UpdateTodoDto){
        return this.todoService.updateTodo(todo)
    }

}
