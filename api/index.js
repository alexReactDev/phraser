const dotenv = require("dotenv");
const express = require("express");
const { graphqlHTTP } = require("express-graphql");

dotenv.config();

const schema = require("./schema.js");
const rootResolver =  require("./src/rootResolver.js");
const throttleMiddleware = require("./src/middleware/throttleMiddleware.js");

const PORT = 4500;

const app = express();

app.use(throttleMiddleware);
app.use("/graphql", graphqlHTTP({
	schema,
	rootValue: rootResolver
}))

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));