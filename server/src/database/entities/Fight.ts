import { DateTime } from "luxon";
import { BaseEntity, Column, Entity, In, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { v4 } from "uuid";
import { ICharacter } from "../../interfaces/Character.interface";
import { IFight } from "../../interfaces/Fight.interface";
import { IRound } from "../../interfaces/Round.interface";
import logger from "../../logger";
import { executeRound } from "../../services/FightService";
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

    static async createFight(input: IFight){
        try {
            let fight: Fight = new Fight();

            fight.playerCharacterId = input.playerId;
            fight.enemyCharacterId = input.enemyId;
            fight.winnerId = input.winner ?? undefined;
            fight.looserId = input.looser ?? undefined;
            fight.date = input.date?? undefined;
            fight.save();
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


export const startFight = async (playerId: string, opponentId: string) => {
    try {
      const player = (await Character.getCharacterById(playerId)) as ICharacter;
      const opponent = (await Character.getCharacterById(
        opponentId
      )) as ICharacter;
  
      const reports: IRound[] = await executeRound(player, opponent, []);
  
      const winner = reports[reports.length -1].fightStatus === 'won';//reports.find((r) => r.fightStatus === "won")
        
      postFightUpdate(
        player.id as string,
        opponent.id as string,
        winner
      );
  
      return {
        reportList: reports,
        numberOfRounds: reports.length,
        winner: winner,
      };
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }
  
  async function postFightUpdate(playerId: string, opponentId: string, playerWon: boolean){
    try {
        const fight: IFight = {
            enemyId: opponentId,
            playerId: playerId,
            date: DateTime.now().toSQL(),
            winner: playerWon? playerId : opponentId,
            looser: playerWon? opponentId : playerId,
        }
        
        await Fight.createFight(fight);
        
        const chars = await Character.find({where: {id: In([playerId, opponentId])}});
  
        chars.map((c) => {
            if(c.id == playerId){
                let rank = c.rank as number;
                if(playerWon) {
                    c.rank = rank +1;
                    c.skillpoints = c.skillpoints as number + 1;
                } else {
                    c.rank = rank > 1 ? rank - 1 : 1;
                    c.lastFight = DateTime.now().toSQL();
                }
            } else {
                if (playerWon) c.lastFight = DateTime.now().toSQL();
            }
            
            return c;
        })
        
        Character.save(chars);
        
        
    } catch (e) {
        logger.error(e);
        throw e;
    }
    
  
  }

