import { IAttack } from "../interfaces/Attack.interface";
import { ICharacter } from "../interfaces/Character.interface";
import { IRound } from "../interfaces/Round.interface";
import logger from "../logger";
import { roll } from "../utils";

export async function startFight(player: ICharacter, enemy: ICharacter){
    let reports: IRound[] = [];
    
    reports = await executeRound(player, enemy, [])

    const winner = reports.find((r) => r.fightStatus === 'won') ? 'player': 'enemy';
    return {reportList: reports, numberOfRounds: reports.length, winner: winner}
}

export async function executeRound(player: ICharacter, enemy: ICharacter, list: IRound[]): Promise<IRound[]>{
    let roundReport: IRound = {
        roundNumber: list.length +1,
        player: {
            attackValue: 0, 
            healthLost: 0
        }, 
        enemy: {
            attackValue: 0, 
            healthLost: 0
        }
    }

    const playerAttack = await executeAttack(player, enemy);

    const playerAttackResult = handleAttackResult(playerAttack, enemy);

    
        roundReport.player = {
            attackValue: playerAttack.attackRoll, 
            healthLost: 0
        }
        roundReport.enemy = {
            attackValue: 0,
            healthLost: playerAttackResult.diff
        }
        
        enemy.health = enemy.health - roundReport.enemy.healthLost;
        if(playerAttackResult.newDefenderHealth > 0){
            const enemyAttack = await executeAttack(enemy, player);

            const enemeyAttackResult = handleAttackResult(enemyAttack, player);

            roundReport.enemy.attackValue = enemyAttack.attackRoll;
            roundReport.player.healthLost = enemeyAttackResult.diff; 
            player.health = player.health - roundReport.player.healthLost;

            if(enemeyAttackResult.newDefenderHealth === 0){
                roundReport.fightStatus = 'lost';
                list.push(roundReport);
                return list;
            } else {
                list.push(roundReport);
                return executeRound(player, enemy, list)
            }

        } else {
            roundReport.fightStatus = 'won';
            list.push(roundReport);
            return list;
        }
    
}

function handleAttackResult(data: IAttack, defender: ICharacter){
    const result: any = {
        oldDefenderHealth: defender.health,
        newDefenderHealth: data.isSuccess? defender.health - data.attackValue : defender.health
    }
    
    result.diff = result.oldDefenderHealth - result.newDefenderHealth;
    
    return result;
}

export async function executeAttack(attacker: ICharacter, defender: ICharacter): Promise<IAttack>{
    try {
        logger.info(attacker, 'attacker stats');
        logger.info(defender, 'defender stats');
        let attackValue: number;
        const attack: IAttack = {
            isSuccess: false,
            attackValue: 0,
            attackRoll: 0
        };

        const attackRoll = roll(attacker.attack);
        logger.info(`attackroll:: ${attackRoll}`);
        const damage = attackRoll - defender.defense ;
        logger.info(`damage:: ${damage}`);
        attackValue = damage;

        if(damage === attacker.magik){
            attackValue = damage + attacker.magik;
        }

        if (attackValue > 0){
            attack.isSuccess = true;
        }
        logger.info(`attackValue:: ${attackValue}`);
        attack.attackRoll = attackRoll;
        attack.attackValue = attack.isSuccess? attackValue : 0 

        logger.info(attack, 'attack result');
        return attack;
    } catch(e) {
        logger.error(e);
        throw e;
    }
}


