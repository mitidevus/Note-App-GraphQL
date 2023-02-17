import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHTTPServer } from "@apollo/server/plugin/drainHttpServer";
import bodyParser from "body-parser";
import express from "express";
import http from "http";

const app = express();
const httpServer = http.createServer(app);

const typeDefs = "";
const resolvers = {};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHTTPServer({ httpServer })],
});

await server.start();

app.use(cors(), bodyParser.json(), expressMiddleware(server));

await new Promise((resolve) => httpServer.listen({ port: 4000 }, resove));
console.log("Server ready at http://localhost:4000");
