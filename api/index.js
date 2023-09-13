const express = require("express");
const { graphqlHTTP } = require("express-graphql");

const schema = require("./schema.js");
const rootResolver =  require("./src/rootResolver.js");

const PORT = 4500;

const app = express();

app.use("/graphql", graphqlHTTP({
	schema,
	rootValue: rootResolver
}))

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));