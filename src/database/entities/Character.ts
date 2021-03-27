import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import { v4 } from "uuid";
import { UserType } from "./User";

export default class Character {
    id?: string;
    name: string;
    skillpoints: number;
    health: number;
    attack: number;
    defense: number;
    magik: number;
    userId?: string;

    constructor(data: Character){
        this.id = v4();
        this.name = data.name;
        this.skillpoints = 12;
        this.health = data.health;
        this.defense = data.defense;
        this.magik = data.magik
        this.attack = data.attack;
    }
}

export const CharacterType = new GraphQLObjectType({
    name: 'Character',
    fields: {
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        skillpoints: {type: GraphQLInt},
        health: {type: GraphQLInt},
        defense: {type: GraphQLInt},
        magik: {type: GraphQLInt},
        user: { type: UserType}
    }
})