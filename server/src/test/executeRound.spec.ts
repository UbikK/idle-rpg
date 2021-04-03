import anyTest, {TestInterface} from 'ava';
import sinon, { SinonStub } from "sinon";
import { ICharacter } from "../interfaces/Character.interface";
import { IRound } from '../interfaces/Round.interface';
import * as fightService from '../services/FightService';

const test = anyTest as TestInterface<{executeAttack: SinonStub}>;

test.before(t => {
    t.context = {executeAttack: sinon.stub(fightService, 'executeAttack')};
})
test.after(async t => {
    sinon.verifyAndRestore();
})

test('executeRound::1 round victory', async t => {
    
    const player: ICharacter = {
        health: 123,
        attack: 12,
        defense: 13,
        magik: 12
    }

    const opponent: ICharacter = {
        health: 2,
        attack: 1,
        defense: 1,
        magik: 1
    }

    t.context.executeAttack.returns({
        attackRoll: 5,
        startingDefenderHealth: 2,
        modifiedDefenderHealth : -2,
        lostDefenderHealth : 4
    });

    const rounds = await fightService.executeRound(player, opponent, []);
    t.assert(rounds.length ==1)
    t.assert(rounds[0].fightStatus == 'won');
    t.assert(rounds[0].enemy.healthLost == 4);
})

test('executeRound::1 round defeat', async t => {
    const opponent: ICharacter = {
        health: 123,
        attack: 12,
        defense: 13,
        magik: 12
    }

    const player: ICharacter = {
        health: 2,
        attack: 1,
        defense: 1,
        magik: 1
    }

    t.context.executeAttack.returns({
        attackRoll: 5,
        startingDefenderHealth: 2,
        modifiedDefenderHealth : -2,
        lostDefenderHealth : 4
    });

    const rounds = await fightService.executeRound(player, opponent, []);
    t.assert(rounds.length ==1)
    t.assert(rounds[0].fightStatus == 'lost');
    t.assert(rounds[0].player.healthLost == 4);
});

test('executeRound::multi round victory', async t => {
    const opponent: ICharacter = {
        health: 10,
        attack: 1,
        defense: 0,
        magik: 1
    }

    const player: ICharacter = {
        health: 10,
        attack: 1,
        defense: 0,
        magik: 1
    }

    t.context.executeAttack.returns({
        attackRoll: 5,
        startingDefenderHealth: 10,
        modifiedDefenderHealth : 5,
        lostDefenderHealth : 5
    });
    

    const rounds = await fightService.executeRound(player, opponent, []);
    t.assert(rounds.length > 1)
    const finalRound = rounds.find((r) => {return r.fightStatus == 'won'}) as IRound;
    t.assert(rounds.indexOf(finalRound) == rounds.length -1);
});

test('executeRound::multi round defeat', async t => {
    const opponent: ICharacter = {
        health: 15,
        attack: 1,
        defense: 0,
        magik: 1
    }

    const player: ICharacter = {
        health: 10,
        attack: 1,
        defense: 0,
        magik: 1
    }

    t.context.executeAttack.returns({
        attackRoll: 5,
        startingDefenderHealth: 10,
        modifiedDefenderHealth : 5,
        lostDefenderHealth : 5
    });
    
    
    const rounds = await fightService.executeRound(player, opponent, []);
    
    t.assert(rounds.length > 1)
    const finalRound = rounds.find((r) => {return r.fightStatus == 'lost'}) as IRound;
    t.assert(rounds.indexOf(finalRound) == rounds.length -1);
});

