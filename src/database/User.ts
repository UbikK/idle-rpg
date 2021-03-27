import { hashSync } from "bcrypt";
import { GraphQLObjectType, GraphQLString } from "graphql";
import { v4 } from "uuid";
import { db } from "./Connection";

export default class User {
    id: string;
    username: string;
    password: string;

    constructor({username, pwd}: {username: string, pwd: string}){
        this.id = v4();
        this.username = username;
        this.password = hashSync(pwd, 256);
    }

    static get(id: string){
        return db.query(`select * from user where id = ${id}`);
    }
}

export const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: {type: GraphQLString},
        username: {type: GraphQLString},
        password: {type: GraphQLString}
    }
})