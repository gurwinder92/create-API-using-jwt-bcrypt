const express = require("express");
const mongoose = require("mongoose");
  const app = express();
const route = require("./router/userRoutes");
const bodyparser = require("body-parser");
const port = 2025;
const server_url = "mongodb://localhost:27017/userId";
app.use(bodyparser.json());
app.use(express.json());
mongoose.connect(server_url);
app.use("/", route);

const database = mongoose.connection;
database.once("open", (_) => {
  console.log(`Successfully connected to database`, server_url);
});
database.on(`error`, (err) => {
  console.log(`database connection failed. exiting now...`, err);
});
app.listen(port, () => {
  console.log(`server listening at localhost: ${port}`);
});
