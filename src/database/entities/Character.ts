import { GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { DateTime } from "luxon";
import { BaseEntity, Brackets, Column, Entity, JoinColumn, Like, ManyToOne, Not, OneToMany, PrimaryColumn } from "typeorm";
import { parse, v4 } from "uuid";
import { CHAR_TYPE } from "../../constants";
import logger from "../../logger";
import { roll, sortListByCriteria } from "../../utils";
import Fight from "./Fight";
import User, { UserInputType, UserType } from "./User";

@Entity({schema: 'public', name:'character'})
export default class Character extends BaseEntity{

    @PrimaryColumn({type: 'uuid', name: 'id'})
    id?: string;

    @Column({type: 'varchar', name: 'name'})
    name?: string;

    @Column({type: 'int4', name: 'skillpoints'})
    skillpoints?: number;

    @Column({type: 'int4', name: 'rank'})
    rank?: number;

    @Column({type: 'int4', name: 'health'})
    health: number;

    @Column({type: 'int4', name: 'attack'})
    attack: number;

    @Column({type: 'int4', name: 'defense'})
    defense: number;

    @Column({type: 'timestamp', name:'lastfight'})
    lastFight?: number;

    @Column({type: 'int4', name: 'magik'})
    magik: number;

    @Column({type: 'varchar', name: 'type', enum: CHAR_TYPE })
    type?: CHAR_TYPE;

    @Column({type: 'uuid', name: 'userid'})
    userId?: string;

    @ManyToOne(() => User, user => user.characters)
    @JoinColumn({name: 'userid', referencedColumnName: 'id'})
    user?: User;

    @OneToMany(() => Fight, f => f.player)
    fightsAsPlayer?: Fight[];

    @OneToMany(() => Fight, f => f.enemy)
    fightsAsEnemy?: Fight[];

    @OneToMany(() => Fight, f => f.winner)
    fightsWon?: Fight[];

    @OneToMany(() => Fight, f => f.looser)
    fightsLost?: Fight[];

    constructor(){
        super();
        this.id = v4();
        this.attack = 0;
        this.health = 0;
        this.defense = 0;
        this.magik = 0;
    }

    static async createOrEditChar(data: any){
        try {
            logger.info(data)
            let char: Character;

            if(data.id) char = await this.findOneOrFail(data.id);
            else char = new Character();
            if(!char.name) char.name = data.name;
            char.health = data.health;
            char.attack = data.attack;
            char.defense = data.defense;
            char.magik = data.magik;
            char.skillpoints = data.skillpoints;
            char.rank = data.rank;

            if(!char.userId){
                char.userId = data.userId ?? undefined;
            }

            if(!char.type){
                char.type = char.userId? CHAR_TYPE.PC : CHAR_TYPE.ENEMY;
            }

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
        return await Promise.all(list.map((c) => Character.createOrEditChar(c)));
    }
}

export async function selectOpponent(charId: string){
    try {
        const player = await Character.findOneOrFail(charId);
        const now = DateTime.now();
        const lastHour = now.minus({hours: 1});

        let opList = await Character.createQueryBuilder('ops')
            .where('id::"varchar" != :playerId', {playerId: player.id})
            .andWhere(new Brackets((qb) => {
                qb.where('lastFight < :lastHour', {lastHour: lastHour.toSQL()})
                    .orWhere('lastFight is null')
            }))
            .getMany();

        if (opList.length > 0){
            // get enemies with closest rank to player
            const sortedByRank = sortListByCriteria(opList, {name: 'rank', value:((v: number) => {return v - (player.rank as number)})});

            if (sortedByRank[0].list.length > 1){
                // get enemies with less number of past fights with player
                const sortedByFights = sortListByCriteria(sortedByRank[0].list, {
                    name: 'fightsAsEnemy', 
                    value: ((l: any[]) => {
                        return l.filter((f) => f.playerCharacterId === player.id).length
                        })
                    });
                
                if (sortedByFights[0].list.length > 1){
                    // get random enemy with closest rank and lower number of fights with player
                    return sortedByFights[0].list[roll(sortedByFights[0].list.length - 1)];
                } else {
                    return sortedByFights[0].list[0];
                }
            } else {
                return sortedByRank[0].list[0];
            }
        } else return []
        
            
    } catch(e) {
        logger.error(e);
        throw e;
    }
}

export const CharacterType = new GraphQLObjectType({
    name: 'Character',
    fields: {
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        skillpoints: {type: GraphQLInt},
        rank: {type: GraphQLInt},
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
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        health: {type: GraphQLInt},
        attack: {type: GraphQLInt},
        defense: {type: GraphQLInt},
        magik: {type: GraphQLInt},
        rank: {type: GraphQLInt},
        skillpoints: {type: GraphQLInt},
        userId: { type: GraphQLString}
    }
  });