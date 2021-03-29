import { Router } from "express";
import { graphqlHTTP } from "express-graphql";
import { schema } from './database/Schema';

const router = Router();
router.get('/', (req, res, next) => {
    res.send('coucou')
})

/* router.use('/graphql', graphqlHTTP({
    schema: schema,
    pretty: true
})); */

/* router.use('/graphql', graphqlExpress({ schema: schema }))) */

export default router;