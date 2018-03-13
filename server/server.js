
import express from 'express';
import {
  graphqlExpress,
  graphiqlExpress,
} from 'graphql-server-express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { schema } from './src/schema';
import transporter from './src/smtp';
var cookieParser = require('cookie-parser')

import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import redis from "redis";
import collections from "./src/mongo"

const client = redis.createClient();
client.on("connect", function () {
    client.set("foo_rand000000000000", "redis connected", redis.print);
    client.get("foo_rand000000000000", function(error, get){console.log(get);});
});

const PORT = 4000;
const server = express();

server.use('*', cors({ origin: '*' }));
server.use(cookieParser());
server.use('/graphql', bodyParser.json(), (req, res)=>graphqlExpress({
  schema,
  context: { req, res, client, transporter, collections },
})(req, res));

server.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://localhost:4000/subscriptions`
}));

// We wrap the express server so that we can attach the WebSocket for subscriptions
const ws = createServer(server);

ws.listen(PORT, () => {
  console.log(`GraphQL Server is now running on http://localhost:${PORT} \n WebSockets available on ws://localhost:4000/subscriptions`);

  // Set up the WebSocket for handling GraphQL subscriptions
  new SubscriptionServer({
    execute,
    subscribe,
    schema
  }, {
    server: ws,
    path: '/subscriptions',
  });
});
