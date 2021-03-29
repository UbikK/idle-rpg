import { hashSync } from "bcrypt";
import { GraphQLInputObjectType, GraphQLNonNull, GraphQLObjectType, GraphQLScalarType, GraphQLString } from "graphql";
import { sign } from "jsonwebtoken";
import { BaseEntity, Column, Entity, getManager, JoinColumn, OneToMany, PrimaryColumn } from "typeorm";
import { v4 } from "uuid";
import Constants from "../../constants";
import logger from "../../logger";
import { getLoginToken } from "../../utils";
import Character from "./Character";

@Entity({schema: 'public', name: 'user'})
export default class User extends BaseEntity {

    @PrimaryColumn({type: 'uuid', name:'id'})
    id?: string;

    @Column({type: 'varchar', name:'username'})
    username?: string;

    @Column({type: 'varchar', name:'firstname'})
    firstName?: string;

    @Column({type: 'varchar', name:'lastname'})
    lastName?: string;

    @Column({type: 'varchar', name: 'password'})
    password?: string;

    @OneToMany(() => Character, c => c.user)
    characters?: Character[]

    token?: string;

    constructor(){
        super();
        this.id = v4();
    }

    static async createUser(data: {username: string, pwd: string, firstname: string, lastname: string}){
        try {
            let user = new User();
            user.username = data.username;
            user.password = hashSync(data.pwd, 256);
            user.firstName = data.firstname;
            user.lastName = data.lastname;
            user = await user.save();
            user.token = getLoginToken(user);
            return user;
        } catch(e){
            logger.error(e);
            throw e;
        }
        
    }

    static getById(id: string): Promise<User | undefined>{
        return this.findOne(id);
    }

    static async getByUsername(username: string): Promise<User>{
        try {
            return await this.createQueryBuilder('user').where('username = :data', {data: username}).getOneOrFail();
        } catch(e) {
            logger.error(e);
            throw e;
        }
    }

    static async getCharacterList(userId: string): Promise<Character[] | undefined>{
        try {
            const user = await this.findOne(userId, {relations: ['characters']});
            return user?.characters;
        } catch (e) {
            logger.error(e);
            throw e;
        }
    }
}

export const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: {type: GraphQLString},
        username: {type: GraphQLString},
        token: {type: GraphQLString}
    }
})

export const UserInputType = new GraphQLInputObjectType({
    name: 'UserInput',
    fields: {
      username: { type: new GraphQLNonNull(GraphQLString) },
      pwd: { type: new GraphQLNonNull(GraphQLString) },
      firstname: { type: new GraphQLNonNull(GraphQLString) },
      lastname: { type: new GraphQLNonNull(GraphQLString) },
    }
  });