import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection, createConnection } from 'mongoose';

@Injectable()
export class MongoConnectionService {

    private dbConnection: Connection;


    database = this.configService.get<string>('DATABASE');
    host = this.configService.get<string>('HOST');
    cluster = this.configService.get<string>('CLUSTER');
    password = this.configService.get<string>('PASSWORD');
    local = this.configService.get<boolean>('LOCAL');


    constructor(private configService: ConfigService){
        this.createConnectionDB();
    }

    async createConnectionDB(){
        let DB_URI
        console.log(this.local);
        
        if(this.local == true)
            DB_URI = 'mongodb://'+this.host+'/'+this.database
        else
            DB_URI = 'mongodb+srv://'+this.host+':'+this.password+'@'+this.cluster+'/?retryWrites=true&w=majority'

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
