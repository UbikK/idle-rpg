import { Router } from "express";
import Character, { selectOpponent } from "./database/entities/Character";
import User from "./database/entities/User";
import { ICharacter } from "./interfaces/Character.interface";
import { startFight } from "./services/FightService";

const router = Router();
router.get('/', async (req, res, next) => {

    res.send(await Character.getCharacterById('aeeb0044-b158-4ca2-9462-7879f47dd6d7'))
})

router.post('/fight', async (req, res, next) => {

    const body = req.body;
    res.send(await startFight(body.playerId, body.opponentId));
})

router.post('/enemies', async (req, res, next) => {
    const list = req.body;
    res.send(await Character.createEnemies(list));
})

export default router;
