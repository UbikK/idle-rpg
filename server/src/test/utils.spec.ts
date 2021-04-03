import test from "ava";
import Character from "../database/entities/Character";
import Fight from "../database/entities/Fight";
import { roll, sortListByCriteria } from "../utils";
import { enemies, sortedByFights, sortedByRank, sortedByRankOnlyOne } from './EnemiesList';

test('sort by ranks', t => {
    const sortedByRank = sortListByCriteria(enemies, {name: 'rank', value:((v: number) => {return v - 1})});
    sortedByRank.forEach((s, index) => {
        const compare = sortedByRankOnlyOne[index];
        s.list.forEach((o, index) => {
            const compareO: {[key:string]: any} = compare.list[index];
            Object.keys(o).forEach((key) => {
                t.assert(o[key] == compareO[key]);
            })
        })
        
    })
});

test('sort by number of fights', t => {
    const player = {
        id: 'testChar',
        health: 10,
        attack: 1,
        defense: 0,
        magik: 1,
        rank: 1
    } as Character;


    const sortedByFights = sortListByCriteria(sortedByRank[0].list, {name: 'fightsAsEnemy', 
    value: ((l: Fight[]) => {
            return l.filter((f) => f.playerCharacterId === player.id).length
        })
    });
    t.assert(sortedByFights.length == 2)
        sortedByFights.forEach((s, index) => {
            const compare = sortedByFights[index];
            s.list.forEach((o, index) => {
                const compareO: {[key:string]: any} = compare.list[index];
                Object.keys(o).forEach((key) => {
                    t.assert(o[key] == compareO[key]);        
                })
            })
            
        })
});

test('roll: test on 1d6', t => {
    const max = 6;
    let i: number = 0
    const results = [];
    while (i <= max){
        results.push(roll(max));
        i++;
    }
    t.assert(results.length == 7);
    t.log(results)
    results.forEach((n) => {
        t.assert((0 < n) && (n <= max));
    })
})

test('roll: test on array length', t => {
    const list = [1,2,3,4,5,6]
    const max = list.length - 1;
    let i: number = 0
    const results = [];
    while (i <= list.length){
        results.push(roll(max, true));
        i++;
    }
    t.assert(results.length == 7);
    t.log(results)
    results.forEach((n) => {
        t.assert((0 <= n) && (n <= max));
    })
})