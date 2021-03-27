import { Client } from "pg";

class DBConnection{
    client: Client = new Client({
        host: 'db',
        database: process.env.POSTGRES_DB,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD
    });
    contructor(){}
}

export const db = new DBConnection().client;