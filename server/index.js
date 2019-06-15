const http = require("http");
const express = require("express");
const app = express();
require("dotenv").config();
const server = http.createServer(app);
const graphqlHTTP = require("express-graphql");
const schema = require("./schema");
const cors = require("cors");
const ensureAuthentication = require("./middleware/auth");
const io = require("socket.io")(server);

app.use(cors());

app.use((req, res, next) => {
  if (
    req.url !== "/graphql" &&
    req.url !== "/playground" &&
    req.url !== "/" &&
    !req.url.includes("/static")
  ) {
    res.redirect("/");
  } else {
    next();
  }
});

app.use(express.static("./build"));
app.use(
  "/graphql",
  ensureAuthentication,
  (req, res, next) => {
    req.io = io;
    next();
  },
  graphqlHTTP({
    schema: schema
  })
);
// Dev playground for graphQL
const expressPlayground = require("graphql-playground-middleware-express")
  .default;
app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

// Error handler
app.use((err, req, res, next) => {
  if (err) {
    res.status(500).json(err);
  } else {
    const error = new Error("Not found");
    res.status(404).json(error);
  }
});

server.listen(process.env.PORT, () =>
  console.log(`Server listening on port ${process.env.PORT}`)
);
