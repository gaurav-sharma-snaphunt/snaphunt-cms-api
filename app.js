const express = require("express");
const app = express();
// var cookieParser = require("cookie-parser");
const feedbackRouter = require("./routes/feedback.route");
const jwtRouter = require("./routes/jwt.route");
const sessionRouter = require("./routes/session.route");
const cors = require("cors");

app.use(cors());
app.use(express.json());
// app.use(cookieParser());

app.use("/feedback", feedbackRouter);
app.use("/jwt", jwtRouter);
app.use("/session", sessionRouter);

//returns Hello World
app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

//Error handler
//use try-catch if error handler is not last function that is executed
app.use((err, req, res, next) => {
  console.log("app.js error handler was called");
  if (!err.message) {
    return res
      .status(500)
      .send("Error: something unexpected has happened. Error has no handler.");
  }
  //   return res.status(400).send({ message: err.message });
  return res.status(403).send({ message: err.message });
});

module.exports = app;
