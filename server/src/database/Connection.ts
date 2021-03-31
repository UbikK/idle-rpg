import { Client } from "pg";
import Constants from "../constants";

class DBConnection{
    client: Client = new Client({
        connectionString:Constants.db_uri, 
        ssl: { rejectUnauthorized: false }
    });
    contructor(){}
}

export const db = new DBConnection().client;