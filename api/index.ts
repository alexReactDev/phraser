import { isTokenRevoked } from "./src/misc/isTokenRevoked";

import dotenv from "dotenv";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import { expressjwt } from "express-jwt";

dotenv.config();

import rootSchema from "./schema";
import rootResolver from "./src/rootResolver";
import throttleMiddleware from "./src/middleware/throttleMiddleware";
import sessionsCleanup from "./src/misc/sessionsCleanup";

const PORT = process.env.PORT;

const app = express();

app.use(throttleMiddleware);
app.use(expressjwt({ 
	secret: (process.env.JWT_SECRET as string), 
	algorithms: ["HS256"], 
	credentialsRequired: false, 
	isRevoked: isTokenRevoked
}));
app.use("/graphql", graphqlHTTP((req: any) => ({
	schema: rootSchema,
	rootValue: rootResolver,
	context: { auth: req.auth }
})))

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

setInterval(sessionsCleanup, 1000 * 60 * 60 * 24); //Once per day