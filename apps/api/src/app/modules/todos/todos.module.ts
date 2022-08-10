import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Todo } from '@nxreact/data';
import { MongoConnectionModule } from '../mongo-connection/mongo-connection.module';
import { MongoConnectionService } from '../mongo-connection/mongo-connection.service';
import { todoSchema } from './schemas/todo.schema';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';

@Module({
  imports: [
    MongoConnectionModule,
  ],
  controllers: [TodosController],
  providers: [
    TodosService,
    {
      provide: 'TODO_MODEL',
      useFactory: (db: MongoConnectionService) => db.getConnection()
        .model<Todo>('Todo', todoSchema, 'Todos'),
      inject: [MongoConnectionService]
    }, {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
  exports: [TodosService]
})
export class TodosModule { }
