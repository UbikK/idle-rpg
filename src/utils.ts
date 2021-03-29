import { NextFunction, Request, Response } from "express";
import { sign } from "jsonwebtoken";
import Constants from "./constants";
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