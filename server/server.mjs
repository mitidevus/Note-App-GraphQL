import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import bodyParser from "body-parser";
import express from "express";
import http from "http";
import cors from "cors"; // Thư viện cho phép truy cập từ các domain khác
import fakeData from "./fakeData/index.js";
import mongoose from "mongoose";

import { resolvers } from "./resolvers/index.js";
import { typeDefs } from "./schemas/index.js";
import "./firebaseConfig.js";
import { getAuth } from "firebase-admin/auth";

import "dotenv/config";

const app = express();
const httpServer = http.createServer(app);

// Connect to Database
const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.nuflrw8.mongodb.net/?retryWrites=true&w=majority`;
const PORT = process.env.PORT || 4000;

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

// Express middleware (Các hàm được thực thi trước khi request đến server)
const authorizationJWT = async (req, res, next) => {
    console.log({ authorization: req.headers.authorization });
    const authorizationHeader = req.headers.authorization;

    if (authorizationHeader) {
        const accessToken = authorizationHeader.split(" ")[1];

        getAuth()
            .verifyIdToken(accessToken)
            .then((decodedToken) => {
                console.log({ decodedToken });
                res.locals.uid = decodedToken.uid; // Lưu uid vào res.locals.uid
                next();
            })
            .catch((err) => {
                console.log({ err });
                return res.status(403).json({ message: "Forbidden", error: err });
            });
    } else {
        next();
        // return res.status(401).json({ message: 'Unauthorized' });
    }
};

app.use(
    cors(),
    authorizationJWT,
    bodyParser.json(),
    expressMiddleware(server, {
        context: async ({ req, res }) => {
            return { uid: res.locals.uid }; // Lấy uid từ res.locals.uid
        },
    })
); // Thêm các middleware vào express, expressMiddleware là middleware của Apollo Server

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
