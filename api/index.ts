const dotenv = require("dotenv");
const express = require("express");
const { graphqlHTTP } = require("express-graphql");

dotenv.config();

const rootSchema = require("./schema.ts");
const rootResolver =  require("./src/rootResolver.ts");
const throttleMiddleware = require("./src/middleware/throttleMiddleware.js");

const PORT = 4500;

const app = express();

app.use(throttleMiddleware);
app.use("/graphql", graphqlHTTP({
	schema: rootSchema,
	rootValue: rootResolver
}))

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));