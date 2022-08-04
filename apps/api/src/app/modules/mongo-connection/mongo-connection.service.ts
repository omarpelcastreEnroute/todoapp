import { Injectable } from '@nestjs/common';
import { Connection, createConnection } from 'mongoose';

@Injectable()
export class MongoConnectionService {

    private dbConnection: Connection;

    host = "localhost"
    port = "27017"
    database = "todoapp"

    constructor(){
        this.createConnectionDB();
    }

    async createConnectionDB(){
        const DB_URI = 'mongodb://localhost:27017/'+this.database

        this.dbConnection = await createConnection(DB_URI)
        this.dbConnection.once('open', () => {
            console.log('Connected to ' + this.database);    
        })

        this.dbConnection.once('error', () => {
            console.log('Error connection to '+ this.database);
        })
    }

    getConnection():Connection {
        return this.dbConnection
    }
}
