const express = require("express");
const app = express();
require("dotenv").config()
const graphqlHTTP = require("express-graphql");
const schema = require("./schema");

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema
  })
);

// Dev playground for graphQL
const expressPlayground = require("graphql-playground-middleware-express")
  .default;
app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

app.listen(process.env.PORT, () =>
  console.log(`Server listening on port ${process.env.PORT}`)
);
