import { hashSync } from "bcrypt";
import { GraphQLInputObjectType, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { BaseEntity, Column, Entity, getManager, PrimaryColumn } from "typeorm";
import { v4 } from "uuid";
import logger from "../../logger";
import { db } from "../Connection";

@Entity({schema: 'public', name: 'user'})
export default class User extends BaseEntity {

    @PrimaryColumn({type: 'uuid', name:'id'})
    id?: string;

    @Column({type: 'varchar', name:'username'})
    username?: string;

    @Column({type: 'varchar', name: 'password'})
    password?: string;

    constructor(){
        super();
        this.id = v4();
    }

    static createUser(data: {username: string, pwd: string}){
        try {
            const user = new User();
            user.username = data.username;
            user.password = hashSync(data.pwd, 256);
            return user.save();
        } catch(e){
            logger.error(e);
            throw e;
        }
        
    }

    static getById(id: string){
        return this.findOne(id);
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

export const UserInputType = new GraphQLInputObjectType({
    name: 'UserInput',
    fields: {
      username: { type: new GraphQLNonNull(GraphQLString) },
      pwd: { type: new GraphQLNonNull(GraphQLString) },
    }
  });