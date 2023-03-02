import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import bodyParser from "body-parser";
import express from "express";
import http from "http";
import cors from "cors"; // Thư viện cho phép truy cập từ các domain khác
import fakeData from "./fakeData/index.js";
import mongoose from "mongoose";

import "dotenv/config";

const app = express();
const httpServer = http.createServer(app);

import { resolvers } from "./resolvers/index.js";
import { typeDefs } from "./schemas/index.js";

// Connect to Database
const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.nuflrw8.mongodb.net/?retryWrites=true&w=majority`;
const PORT = process.env.PORT || 4000;

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(cors(), bodyParser.json(), expressMiddleware(server)); // Thêm các middleware vào express, expressMiddleware là middleware của Apollo Server

mongoose.set("strictQuery", true);
mongoose
    .connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(async () => {
        console.log("Connected to database");
        await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
        console.log("Server ready at http://localhost:4000");
    });
