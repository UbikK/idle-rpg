import { Router } from "express";
import Character, { selectOpponent } from "./database/entities/Character";
import { startFight } from "./services/FightService";

const router = Router();
router.get('/', async (req, res, next) => {
    res.send(await selectOpponent(req.query.charId as string))
})

router.post('/fight', async (req, res, next) => {

    const body = req.body;
    /* const player: ICharacter = {
        health: 34,
        attack: 12,
        defense: 12,
        magik: 12
    }

    const enemy: ICharacter = {
        health: 34,
        attack: 12,
        defense: 8,
        magik: 12
    } */

    const player = await Character.getCharacterById(body.playerId) as Character;
    const opponent = await Character.getCharacterById(body.opponentId) as Character;

    res.send(await startFight(player, opponent));
})

router.post('/enemies', async (req, res, next) => {
    const list = req.body;
    console.log(list)
    res.send(await Character.createEnemies(list));
})

export default router;