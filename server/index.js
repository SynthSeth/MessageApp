const express = require("express");
const app = express();
require("dotenv").config();
const graphqlHTTP = require("express-graphql");
const schema = require("./schema");
const cors = require("cors");
const ensureAuthentication = require("./middleware/auth");

app.use(cors());


app.use(
  "/graphql", ensureAuthentication,
  graphqlHTTP({
    schema: schema
  })
);

// Dev playground for graphQL
const expressPlayground = require("graphql-playground-middleware-express")
  .default;
app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

// Error handler
app.use((err, req, res) => {
  if (err) {
    res.error(err);
  } else {
    const error = new Error("Not found");
    res.status = 404;
    res.error(error);
  }
});

app.listen(process.env.PORT, () =>
  console.log(`Server listening on port ${process.env.PORT}`)
);
