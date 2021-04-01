export default interface Character {
    rank: number;
    skillpoints: number;
    name: string;
    id: string;
    health: number;
    attack: number;
    defense: number;
    magik: number;
    lastFight: string;
    fights?:any[]
}