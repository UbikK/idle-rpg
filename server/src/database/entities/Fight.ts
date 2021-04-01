import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { v4 } from "uuid";
import logger from "../../logger";
import Character from './Character';

@Entity({schema: 'public', name:'fight'})
export default class Fight extends BaseEntity {
    @PrimaryColumn({type:'uuid', name: 'id'})
    id?: string;

    @Column({type: 'uuid', name: 'playercharacterid'})
    playerCharacterId?: string;

    @Column({type: 'uuid', name: 'enemycharacterid'})
    enemyCharacterId?: string;

    @Column({type: 'uuid', name:'winner'})
    winnerId?: string;

    @Column({type: 'uuid', name:'looser'})
    looserId?: string;

    @Column({type: 'timestamp', name:'date'})
    date?: string;

    @ManyToOne(() => Character, c => c.fightsAsPlayer)
    @JoinColumn({name: 'playercharacterid', referencedColumnName:'id'})
    player?: Character;

    @ManyToOne(() => Character, c => c.fightsAsEnemy)
    @JoinColumn({name: 'enemycharacterid', referencedColumnName:'id'})
    enemy?: Character;

    @ManyToOne(() => Character, c => c.fightsWon)
    @JoinColumn({name: 'winner', referencedColumnName:'id'})
    winner?: Character;

    @ManyToOne(() => Character, c => c.fightsLost)
    @JoinColumn({name: 'looser', referencedColumnName:'id'})
    looser?: Character;

    constructor(){
        super();
        this.id = v4();
    }

    static async createOrEditFight(input: any){
        try {
            let fight: Fight;
            if(input.id){
                fight = await this.findOneOrFail(input.id)
            } else {
                fight = new Fight();
            }

            fight.playerCharacterId = input.attacker;
            fight.enemyCharacterId = input.enemy;
            fight.winner = input.winner ?? undefined;
            fight.looser = input.looser ?? undefined;
            fight.date = input.finishedAt?? undefined;
        } catch(e) {
            logger.error(e);
            throw e;
        }
    }

    static async getFightById(id: string){
        try{
            return await this.findOneOrFail(id, {relations: ['player', 'enemy', 'winner', 'looser']})
        } catch(e){
            logger.error(e);
            throw e;
        }
    }

    static async getFightsForPlayer(playerId: string){
        try {
            return await this.find({where: {playerCharacterId: playerId}, relations: ['player', 'enemy', 'winner', 'looser']})
        } catch(e) {
            logger.error(e);
            throw e;
        }
    }
}



