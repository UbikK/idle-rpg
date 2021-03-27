import { Router } from "express";
import { graphqlHTTP } from "express-graphql";
import schema from './database/Schema';
import root from './database/Root';

const router = Router();
router.get('/', (req, res, next) => {
    res.send('coucou')
})
router.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}))

router.post('/signup')

export default router;