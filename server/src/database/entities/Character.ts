import { DateTime } from "luxon";
import { BaseEntity, Column, Entity, In, IsNull, JoinColumn, LessThan, ManyToOne, Not, OneToMany, PrimaryColumn } from "typeorm";
import { v4 } from "uuid";
import { CHAR_TYPE } from "../../constants";
import { ICharacter } from "../../interfaces/Character.interface";
import logger from "../../logger";
import { roll, sortListByCriteria } from "../../utils";
import Fight from "./Fight";
import User from "./User";

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
    lastFight?: string;

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

    static async createOrEditChar(data: ICharacter){
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

    static async getCharacterById(id: string, withFight?: boolean){
        let options = {};
        if(withFight){
            options =  {relations:['fightsAsPlayer', 'fightsAsPlayer.winner', 'fightsAsPlayer.looser', 'fightsAsPlayer.player', 'fightsAsPlayer.enemy']}
        }
        return this.findOne(id,options);
    }

    static async createEnemies(list: any[]){
        return await Promise.all(list.map((c) => Character.createOrEditChar(c)));
    }

    
}

export const selectOpponent = async (charId: string): Promise<{player: Character, opponent?: Character}> =>{
    try {
        const player = await Character.findOneOrFail(charId);
        const fightSetting = {
            player: player,
            opponent: undefined
        }
        const now = DateTime.now();
        const lastHour = now.minus({hours: 1});

            const opList:Character[] = await Character.find(
                {where: [
                    {id: Not(charId), lastFight:LessThan(lastHour.toSQL())},
                    {id: Not(charId), lastFight:IsNull()}
                    ]
                })
            logger.info(opList, 'opList')

        if (opList.length > 0){
            // get enemies with closest rank to player
            const sortedByRank = sortListByCriteria(opList, {name: 'rank', value:((v: number) => {return v - (player.rank as number)})});
            logger.info(sortedByRank, 'sortedbyRank')
            if (sortedByRank[0].list.length > 1){
                // get enemies with less number of past fights with player
                const sortedByFights = sortListByCriteria(sortedByRank[0].list, {
                    name: 'fightsAsEnemy', 
                    value: ((l: any[]) => {
                        return l.filter((f) => f.playerCharacterId === player.id).length
                        })
                    });
                    logger.info(sortedByFights, 'sortedByFights')
                if (sortedByFights[0].list.length > 1){
                    // get random enemy with closest rank and lower number of fights with player
                    fightSetting.opponent = sortedByFights[0].list[roll(sortedByFights[0].list.length - 1)];
                    return fightSetting;
                } else {
                    fightSetting.opponent = sortedByFights[0].list[0];
                    return fightSetting;
                }
            } else {
                fightSetting.opponent = sortedByRank[0].list[0];
                return fightSetting
            }
        } else return fightSetting
        
            
    } catch(e) {
        logger.error(e);
        throw e;
    }
}

