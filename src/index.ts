import { json, urlencoded } from "body-parser";
import express, { Application } from "express";
import PinoHttp from "pino-http";
import router from './router';
import { db } from './database/Connection';

const app: Application = express();
app.use(PinoHttp);
const port = process.env.PORT? process.env.PORT : 24269;
app.set('port', port);

app.use(json({
    limit:'100kb',
    type: 'application/json'
}));
app.use(urlencoded({
    type: 'application/x-www-form-urlencoded',
    limit: '100kb',
    extended: true
}));

app.use('/', router);


const server = app.listen(app.get('port'), async () => {
    try {
        await db.connect();
    } catch (e) {
        console.log(e);
        
    }
    console.log('listening on ' + app.get('port'));
})


process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    console.log('Closing http server.');
    server.close(() => {
      console.log('Http server closed.');
      db.end()
      .then(() => console.log('client has disconnected'))
      .catch(err => console.error('error during disconnection', err.stack))
    });
  });