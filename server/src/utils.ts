import { NextFunction, Request, Response } from "express";
import { sign } from "jsonwebtoken";
import Constants from "./constants";
import Character from "./database/entities/Character";
import User from "./database/entities/User";
import logger from "./logger";

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
    let result: {key: number, list: any[]}[] = [];

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

    result = result.sort((i, j) => {
        if(i.key < j.key){
            return -1;
        }
        if(i.key > j.key){
            return 1;
        }
        return 0;
    });
    return result;
}