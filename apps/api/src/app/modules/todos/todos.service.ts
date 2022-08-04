import { BadRequestException, ConflictException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Todo } from '@nxreact/data';
import { Model } from 'mongoose';
import { TodoDto } from './dto/todo-dto';
import { UpdateTodoDto } from './dto/updateTodo-dto';

@Injectable()
export class TodosService {

    constructor(
        @Inject('TODO_MODEL')
        private todoModel: Model<Todo>,
    ) { }
   
    async createTodo(todo: TodoDto){
        try {
            const newTodo = new this.todoModel(todo)
            await newTodo.save()
            return {todo: newTodo}
        } catch (error) {
            throw new InternalServerErrorException()
        }
    } 

    async getTodos(){
        try{
            const todos = await this.todoModel.find({})
            return {todos}
        }catch(error){
            throw new InternalServerErrorException()
        }
    }

    async updateTodo(updateTodo: UpdateTodoDto){
        try {
            const todoEdited = await this.todoModel.findByIdAndUpdate(updateTodo.id,updateTodo.todo,{new:true}) 
            return {todo: todoEdited}
        } catch (error) {
            console.log(error);
            
            throw new InternalServerErrorException()
        }
    }
   
}
