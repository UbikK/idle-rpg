import Character from "../database/entities/Character";
import { IAttack } from "../interfaces/Attack.interface";
import { IAttackReport } from "../interfaces/AttackReport.interface";
import { ICharacter } from "../interfaces/Character.interface";
import { IRound } from "../interfaces/Round.interface";
import logger from "../logger";
import { roll } from "../utils";

export async function startFight(playerId: string, opponentId: string) {
  try {
    const player = (await Character.getCharacterById(playerId)) as ICharacter;
    const opponent = (await Character.getCharacterById(
      opponentId
    )) as ICharacter;

    const reports: IRound[] = await executeRound(player, opponent, []);

    const winner = reports[reports.length -1].fightStatus === 'won';//reports.find((r) => r.fightStatus === "won")
      
    Character.postFightUpdate(
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

export async function executeRound(
  player: ICharacter,
  enemy: ICharacter,
  list: IRound[]
): Promise<IRound[]> {
  let roundReport: IRound = {
    roundNumber: list.length + 1,
    player: {
      attackValue: 0,
      healthLost: 0,
    },
    enemy: {
      attackValue: 0,
      healthLost: 0,
    },
  };

  const playerAttack = executeAttack(player, enemy);

  roundReport.player = {
    attackValue: playerAttack.attackRoll,
    healthLost: 0,
  };
  roundReport.enemy = {
    attackValue: 0,
    healthLost: playerAttack.lostDefenderHealth,
  };

  enemy.health = enemy.health - roundReport.enemy.healthLost;

  if (enemy.health > 0) {
    const enemyAttack = executeAttack(enemy, player);

    roundReport.enemy.attackValue = enemyAttack.attackRoll;
    roundReport.player.healthLost = enemyAttack.lostDefenderHealth;
    player.health = player.health - roundReport.player.healthLost;

    if (player.health <= 0) {
      roundReport.fightStatus = "lost";
      list.push(roundReport);
      return list;
    } else {
      list.push(roundReport);
      return executeRound(player, enemy, list);
    }
  } else {
    roundReport.fightStatus = "won";
    list.push(roundReport);
    return list;
  }
}

/* function handleAttackResult(data: IAttack, defender: ICharacter){
    const result: any = {
        oldDefenderHealth: defender.health,
        newDefenderHealth: data.isSuccess? defender.health - data.attackValue : defender.health
    }
    
    result.diff = result.oldDefenderHealth - result.newDefenderHealth;
    
    return result;
} */

export function executeAttack(
  attacker: ICharacter,
  defender: ICharacter
): IAttackReport {
  try {
    let attackValue: number;
    const attack: IAttack = {
      isSuccess: false,
      attackValue: 0,
      attackRoll: 0,
    };

    const attackRoll = roll(attacker.attack);
    const damage = attackRoll - defender.defense;
    attackValue = damage;

    if (damage === attacker.magik) {
      attackValue = damage + attacker.magik;
    }

    if (attackValue > 0) {
      attack.isSuccess = true;
    }

    attack.attackRoll = attackRoll;
    attack.attackValue = attack.isSuccess ? attackValue : 0;

    const attackReport: IAttackReport = {
      attackRoll: attackRoll,
      startingDefenderHealth: defender.health,
      modifiedDefenderHealth: attack.isSuccess
        ? defender.health - attackValue
        : defender.health,
      lostDefenderHealth: 0,
    };

    attackReport.lostDefenderHealth =
      attackReport.startingDefenderHealth - attackReport.modifiedDefenderHealth;

    return attackReport;
  } catch (e) {
    logger.error(e);
    throw e;
  }
}
