const express = require("express");
const app = express();
const articleRouter = require("./routes/article.route");

const cors = require("cors");

const corsOptions = {
  origin: [
    // /\.contentful\.com$/,
    "http://localhost:3000",
    "https://snaphunt.com"
  ],
  preflightContinue: false,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

app.use(express.json());

app.use("/articles", articleRouter);

app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

app.use((err, req, res, next) => {
  console.log("--app.js--error handler was called");
  if (!err.message) {
    return res.send("Error: something unexpected has happened.");
  }
  console.log("err.message", err.message);
  if (!err.status) {
    return res.status(500).send(err.message);
  }
  return res.status(err.status).send(err.message);
});

module.exports = app;
