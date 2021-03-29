import { GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { v4 } from "uuid";
import { CHAR_TYPE } from "../../constants";
import logger from "../../logger";
import User, { UserInputType, UserType } from "./User";

@Entity({schema: 'public', name:'character'})
export default class Character extends BaseEntity{

    @PrimaryColumn({type: 'uuid', name: 'id'})
    id?: string;

    @Column({type: 'varchar', name: 'name'})
    name?: string;

    skillpoints?: number;

    @Column({type: 'int4', name: 'health'})
    health?: number;

    @Column({type: 'int4', name: 'health'})
    attack?: number;

    @Column({type: 'int4', name: 'health'})
    defense?: number;

    @Column({type: 'int4', name: 'health'})
    magik?: number;

    @Column({type: 'varchar', name: 'type', enum: CHAR_TYPE })
    type?: CHAR_TYPE;

    @Column({type: 'uuid', name: 'userid'})
    userId?: string;

    @Column({type: 'timestamp', name: 'lastdefeat'})
    lastDefeat?: string;

    @ManyToOne(() => User, user => user.characters)
    @JoinColumn({name: 'userid', referencedColumnName: 'id'})
    user?: User

    constructor(){
        super();
        this.id = v4();
    }

    static async createChar(data: any){
        try {
            const char = new Character();
            char.health = data.health;
            char.attack = data.attack;
            char.defense = data.defense;
            char.magik = data.magik;
            char.userId = data.userId ?? undefined;
            char.type = char.userId? CHAR_TYPE.PC : CHAR_TYPE.ENEMY;
    
            return await char.save();
        } catch (e) {
            logger.error(e);
            throw e;
        }
    }

    static getCharacterById(id: string){
        return this.findOne(id);
    }

    static getEnemies(){
        return this.find({type: CHAR_TYPE.ENEMY});
    }

    static async createEnemies(list: any[]){
        return Promise.all(list.map((c) => Character.createChar(c)));
    }

}


export const CharacterType = new GraphQLObjectType({
    name: 'Character',
    fields: {
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        skillpoints: {type: GraphQLInt},
        health: {type: GraphQLInt},
        attack:{type: GraphQLInt},
        defense: {type: GraphQLInt},
        magik: {type: GraphQLInt},
        userId: {type: GraphQLString},
        lastDefeat: {type: GraphQLString}
    }
})

export const CharInputType = new GraphQLInputObjectType({
    name: 'CharacterInput',
    fields: {
      name: { type: GraphQLString },
      id: { type: GraphQLString },
      health: {type: GraphQLInt},
      defense: {type: GraphQLInt},
      magik: {type: GraphQLInt},
      userId: { type: GraphQLString},
      user: { type: UserInputType}
    }
  });