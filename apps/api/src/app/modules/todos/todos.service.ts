import { BadRequestException, ConflictException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Todo } from '@nxreact/data';
import { Model } from 'mongoose';
import { TodoDto } from './dto/todo-dto';

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
            const todos = await this.todoModel.find({}).sort('-updatedAt')
            return {todos}
        }catch(error){
            throw new InternalServerErrorException()
        }
    }

    async updateTodo(id:string, updateTodo: TodoDto){
        try {
            const todoEdited = await this.todoModel.findByIdAndUpdate(id, updateTodo, {new:true}) 
            if(todoEdited)
                return {todo: todoEdited, statusCode: 200}
            throw new NotFoundException('todo not found')
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async deleteTodo(id: string){
        try {
            const todo = await this.todoModel.findByIdAndDelete(id) 
            if(!todo._id)
                return new NotFoundException('todo not found')
            return true
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }
   
}
