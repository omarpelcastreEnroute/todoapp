import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoConnectionModule } from './modules/mongo-connection/mongo-connection.module';
import { TodosModule } from './modules/todos/todos.module';
import { ThrottlerModule } from '@nestjs/throttler'
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongoConnectionModule,
    TodosModule,
    ThrottlerModule.forRoot({
      ttl: 40,
      limit: 30,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
