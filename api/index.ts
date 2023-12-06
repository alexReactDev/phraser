import { Request } from "express";
import { isTokenRevoked } from "./src/utils/isTokenRevoked";
import { IJWT } from "@ts-backend/authorization";

const dotenv = require("dotenv");
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { expressjwt } = require("express-jwt");

dotenv.config();

const rootSchema = require("./schema.ts");
const rootResolver =  require("./src/rootResolver.ts");
const throttleMiddleware = require("./src/middleware/throttleMiddleware.js");

const PORT = 4500;

const app = express();

interface IReq extends Request {
	auth: IJWT
}

app.use(throttleMiddleware);
app.use(expressjwt({ 
	secret: process.env.JWT_SECRET, 
	algorithms: ["HS256"], 
	credentialsRequired: false, 
	isRevoked: isTokenRevoked
}));
app.use("/graphql", graphqlHTTP((req: IReq) => ({
	schema: rootSchema,
	rootValue: rootResolver,
	context: { auth: req.auth }
})))

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));