import express, { Application, json } from "express";
import logger from "./logger";
import { createConnection } from "typeorm";
import Constants from "./constants";
import PinoHttp from "pino-http";
import { ApolloServer } from "apollo-server-express";
import { schema } from "./database/Schema";
import router from "./router";
import cors from "cors";
import {join} from 'path';

async function startApolloServer() {
  const app: Application = express();
  const server = new ApolloServer({
    schema: schema,
  });
  await server.start();

  const port = process.env.PORT ?? 24269;
  //app.use(PinoHttp({prettyPrint:true}))
  console.log(join(__dirname, '../../client/build'))
  app.use(express.static(join(__dirname, '../../client/build')));
  app.set("port", port);
  app.use("/api", cors(), json(), router);
  //if (process.env.NODE_ENV === 'production') {
    
  //}
  server.applyMiddleware({ app });

  await new Promise((resolve) =>
    app.listen(app.get("port"), async () => {
      try {
        const con = await createConnection({
          type: "postgres",
          url: Constants.db_uri,
          ssl: { rejectUnauthorized: false },
          entities: [`${__dirname}/database/entities/**/*`],
          logging: 'all'
        });
      } catch (e) {
        logger.error(e);
      }
      resolve("ok");
    })
  );
  console.log(
    `Server ready at http://localhost:${app.get("port")}/${server.graphqlPath}`
  );
  return { server, app };
}
startApolloServer()
  .then(() => {
    logger.info("up and running");
    console.log(join(__dirname, '../client/build'))
  })
  .catch((e) => {
    console.error(e);
  });
