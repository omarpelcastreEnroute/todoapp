import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoConnectionService } from './mongo-connection.service';

@Module({
  imports: [
    ConfigModule
  ],
  providers: [MongoConnectionService],
  exports: [
    MongoConnectionService
  ]
})
export class MongoConnectionModule {}
