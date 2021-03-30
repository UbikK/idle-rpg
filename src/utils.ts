import { NextFunction, Request, Response } from "express";
import { sign } from "jsonwebtoken";
import Constants from "./constants";
import Character from "./database/entities/Character";
import User from "./database/entities/User";

export function getLoginToken(user: User){
    return sign(
        {
            id: user.id,
            firstname: user.firstName
        }, Constants.jwt_secret, {expiresIn: 60*60});
}

export function checkUser(req: Request, res: Response, next: NextFunction) {
    const user = req.user as User;
    if (user?.id) {
        next();
    } else {
        res.status(403).send('forbidden');
    }
}

export function roll(maxValue: number){
    return Math.round(Math.random() * maxValue) + 1;
}

export function sortListByCriteria(list: {[key: string]: any}[], criteria: {name: string, value: Function}) {
    const result: {key: number, list: any[]}[] = [];

    list.map((c) => {
        const key = Math.abs(criteria.value(c[criteria.name]));

        let tierList = result.find((l) => l.key == key);

        if(!tierList) {
            tierList = {
                key: key,
                list: []
            };
            result.push(tierList);
        }
        tierList.list.push(c);
    });
    return result;
    
    /* return list.sort((a, b) => {
        
        // by closest rank
        const aRankDiff = Math.abs(a.rank as number - playerRank);
        const bRankDiff = Math.abs(b.rank as number - playerRank);
        
        if (aRankDiff < bRankDiff){
            return -1
            
        }

        if (aRankDiff > bRankDiff){
            return 1;
        }

        // by number of fights with player
        if (a.fightsAsEnemy && b.fightsAsEnemy) {
            const aFightsWithPlayer = a.fightsAsEnemy?.filter((f) => f.playerCharacterId === playerId).length as number;
            const bFightsWithPLayer = b.fightsAsEnemy?.filter((f) => f.playerCharacterId === playerId).length as number;
            if (aFightsWithPlayer < bFightsWithPLayer){
                return -1;
            }
    
            if (aFightsWithPlayer > bFightsWithPLayer){
                return 1;
            }
        }
        

        return 0;
    }); */
}