import { json, urlencoded } from "body-parser";
import express, { Application } from "express";
import router from './router';
import { db } from './database/Connection';
import logger from "./logger";
import { createConnection } from "typeorm";
import Constants from "./constants";

const app: Application = express();

const port = process.env.PORT ?? 24269;
app.set('port', port);

app.use(json({
    type: 'application/json',
}));

app.use(urlencoded({
    type: 'application/x-www-form-urlencoded',
    extended: true
}));

app.use(router);

const server = app.listen(app.get('port'), async () => {
    try {
        const con = await createConnection({
            type: 'postgres',
            url: Constants.db_uri,
            ssl: {rejectUnauthorized: false},
            entities: [`${__dirname}/database/entities/**/*`],
            //logging: 'all'
        });
        console.log('listening on ' + app.get('port'));
    } catch (e) {
        logger.error(e);
        
    }
    
})


process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received.');
    logger.info('Closing http server.');
    server.close(() => {
        logger.info('Http server closed.');
      db.end()
      .then(() => logger.info('client has disconnected'))
      .catch(err => logger.error('error during disconnection', err.stack))
    });
  });