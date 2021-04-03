import test from "ava";
import { ICharacter } from './../interfaces/Character.interface';
import { IAttackReport } from './../interfaces/AttackReport.interface';
import { executeAttack } from "../services/FightService";
import sinon from "sinon";
import * as utils from '../utils';

test.after(async t => {
    sinon.verifyAndRestore();
})

test('executeAttack::success', t => {
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

    const rollStub = sinon.stub(utils, 'roll');
    rollStub.returns(5);

    const report: IAttackReport = executeAttack(player, opponent);
    t.assert(report.startingDefenderHealth == 2)
    t.assert(report.modifiedDefenderHealth == -2)
    t.assert(report.lostDefenderHealth == 4)
    sinon.restore();
});

test('executeAttack::success::magik hit', t => {
    const player: ICharacter = {
        health: 123,
        attack: 12,
        defense: 13,
        magik: 4
    }

    const opponent: ICharacter = {
        health: 2,
        attack: 1,
        defense: 1,
        magik: 1
    }

    const rollStub = sinon.stub(utils, 'roll');
    rollStub.returns(5);

    const report: IAttackReport = executeAttack(player, opponent);
    t.assert(report.startingDefenderHealth == 2)
    t.assert(report.modifiedDefenderHealth == -6)
    t.assert(report.lostDefenderHealth == 8)
    sinon.restore();
});

test('executeAttack::failure', t => {
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

    const rollStub = sinon.stub(utils, 'roll');
    rollStub.returns(5);

    const report: IAttackReport = executeAttack(player, opponent);
    t.assert(report.startingDefenderHealth == 123)
    t.assert(report.modifiedDefenderHealth == 123)
    t.assert(report.lostDefenderHealth == 0)
    sinon.restore();
})