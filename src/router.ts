import { Router } from "express";
import { graphqlHTTP } from "express-graphql";
import jwt from "express-jwt";
import Constants from "./constants";
import User from "./database/entities/User";
import { characterSchema, userSchema } from './database/Schema';
import { loginSchema } from "./services/LoginService";

const router = Router();
router.get('/', (req, res, next) => {
    res.send('coucou')
})
/* router.use('/graphql', graphqlHTTP({
    schema: schema,
    pretty: true
})) */

router.post('/login', graphqlHTTP({
    schema: loginSchema,
    pretty: true
}))

router.post('/signup', graphqlHTTP({
    schema: userSchema,
    pretty: true
}))

router.use('/characters', jwt({secret: Constants.jwt_secret, algorithms: ['HS256']}), (req, res, next) => {
    const user = req.user as User;
    if (user?.id) {
        next();
    } else {
        res.status(403).send('forbidden');
    }
}, graphqlHTTP({
    schema: characterSchema,
    pretty: true
}))

export default router;