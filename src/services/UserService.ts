import User from "../database/User";

export async function createUser(data: {username: string, pwd: string}){
    return new User(data);
}

export async function getUser(id: string){
    return User.get(id);
}