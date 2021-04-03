import anyTest, { TestInterface } from "ava";
import sinon, { createStubInstance, SinonStub, SinonStubbedInstance, SinonStubbedMember, StubbableType } from "sinon";
import Character, { selectOpponent } from '../database/entities/Character';
import * as typeorm from 'typeorm';
import * as utils from '../utils';
import { enemies, sortedByRank, sortedByFights, sortedByRankOnlyOne } from './EnemiesList';
import logger from './../logger';

type StubbedClass<T> = SinonStubbedInstance<T> & T;

const test = anyTest as TestInterface<{player: Character, sortStub: SinonStub}>;

function createSinonStubInstance<T>(
    constructor: StubbableType<T>,
    overrides?: { [K in keyof T]?: SinonStubbedMember<T[K]> },
  ): StubbedClass<T> {
    const stub = createStubInstance<T>(constructor, overrides);
    return stub as unknown as StubbedClass<T>;
  }

test.before(t => {
    t.context.player = {
        id: 'testChar',
        health: 10,
        attack: 1,
        defense: 0,
        magik: 1,
        rank: 1
    } as Character

    sinon.stub(logger)

    const connection = createSinonStubInstance(typeorm.Connection);
    sinon.stub(typeorm, 'getConnection').returns(connection);
    const repo = createSinonStubInstance(typeorm.Repository)
    sinon.stub(Character, 'getRepository').returns(repo);
    repo.findOneOrFail.resolves(t.context.player);

    repo.find.resolves(enemies);

    t.context.sortStub = sinon.stub(utils, 'sortListByCriteria')
});

test.after(async t => {
    sinon.verifyAndRestore();
})

  
test.serial('select an opponent level 1 only one', async t => {

    t.context.sortStub.onCall(0)
    .returns(sortedByRankOnlyOne)
    const setting = await selectOpponent('testChar');
    t.context.sortStub.reset();

    t.assert(setting.opponent != undefined);
    t.assert(setting.opponent?.name === sortedByRank[0].list[0].name)
});

test.serial('select an opponent level 1 sort by fights', async t => {

    t.context.sortStub.onFirstCall()
        .returns(sortedByRank)

        
        t.context.sortStub.onSecondCall()
        .returns(sortedByFights)

    const setting = await selectOpponent('testChar');
    t.assert(setting.opponent != undefined);
    t.assert(setting.opponent?.name === sortedByFights[0].list[0].name)
})