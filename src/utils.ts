import { sign } from "jsonwebtoken";
import Constants from "./constants";
import User from "./database/entities/User";

export function getLoginToken(user: User){
    return sign({id: user.id}, Constants.jwt_secret, {expiresIn: 60*60});
}