import { Schema } from "mongoose";
import { Todo } from '@nxreact/data'
import { Status } from '@nxreact/data'

export const todoSchema = new Schema<Todo>({
    title: {type: String, required: true, minlength:10, maxlength:120},
    description: {type: String, required: true, minlength:100, maxlength:1000},
    status: {type: String, required: true, default: Status.PENDING}
})

