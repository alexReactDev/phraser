import dotenv from "dotenv";
dotenv.config();

import { isTokenRevoked } from "./src/misc/isTokenRevoked";
import express, { NextFunction, Request, Response } from "express";
import { graphqlHTTP } from "express-graphql";
import { expressjwt } from "express-jwt";
import rootSchema from "./schema";
import rootResolver from "./src/rootResolver";
import throttleMiddleware from "./src/middleware/throttleMiddleware";
import sessionsCleanup from "./src/misc/sessionsCleanup";
import logMiddleware from "./src/misc/logMiddleware";
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "https://ca86ddc5e4849db752f5adcba30af61c@o4506399434080256.ingest.sentry.io/4506433288077312"
});

const PORT = process.env.PORT;

const app = express();

app.use("*", logMiddleware);
app.use(throttleMiddleware);
app.use(expressjwt({ 
	secret: (process.env.JWT_SECRET as string), 
	algorithms: ["HS256"], 
	credentialsRequired: false, 
	isRevoked: isTokenRevoked
}));
app.use("/test", (req: Request, res: Response, next: NextFunction) => {
	return res.send(`Connection test successful. Current time: ${new Date().toString()}`);
})
app.use("/graphql", graphqlHTTP((req: any) => ({
	schema: rootSchema,
	rootValue: rootResolver,
	context: { auth: req.auth }
})))

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

setInterval(sessionsCleanup, 1000 * 60 * 60 * 24); //Once per day