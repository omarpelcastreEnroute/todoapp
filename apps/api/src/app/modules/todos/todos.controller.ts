import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { Todo } from '@nxreact/data';
import { TodoDto } from './dto/todo-dto';
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

    @Put(':id')
    updateTodo(@Param('id') id:string, @Body() todo: TodoDto){
        return this.todoService.updateTodo(id ,todo)
    }

}
