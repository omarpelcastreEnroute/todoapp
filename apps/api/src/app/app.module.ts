import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoConnectionModule } from './modules/mongo-connection/mongo-connection.module';
import { TodosModule } from './modules/todos/todos.module';

@Module({
  imports: [
    MongoConnectionModule,
    TodosModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
