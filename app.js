const express = require("express");
const app = express();
const FeedbackModel = require("./feedback.model");
const UserModel = require("./user.model");
const feedback = require("./feedback.methods");
var cookieParser = require("cookie-parser");
const jwToken = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());

//returns Hello World
app.get("/", (req, res, next) => {
  res
    .status(200)
    .send("Hello World")
    .catch(err => {
      //   err.status = 400;
      err.message = `Could not return hello world`;
      next(err);
    });
});

// returns array of all feedback items in db
app.get("/feedback", async (req, res, next) => {
  const { JWT } = req.cookies;
  let decodedToken;
  try {
    decodedToken = await jwToken.verify(JWT, "a-secret-key");
  } catch (err) {
    // err.status = 401;
    err.message = `unauthorized. jwt token is ${decodedToken}`;
    return next(err);
  }

  if (!decodedToken) {
    throw new Error(`decoded token is invalid. token is ${decodedToken}`);
  }
  const foundFeedback = await FeedbackModel.find().catch(err => {
    // err.status = 400;
    err.message = `Could not return all feedback items`;
    next(err);
  });
  res.status(200).send(foundFeedback);
});

//creates a new feedback item in db
app.post("/feedback", async (req, res, next) => {
  try {
    await feedback.createOne(req.body);
    res.status(200).send(`feedback successfully added: ${req.body.text}`);
  } catch (err) {
    // err.status = 500;
    err.message = `Could not add feedback <<${req.body.text}>>`;
    next(err);
  }
});

//updates an existing feedback item in db
app.put("/feedback/:id", async (req, res, next) => {
  try {
    const updatedFeedback = await FeedbackModel.findOneAndUpdate(
      req.params.id,
      req.body
    );
    res.status(200).send(updatedFeedback);
  } catch (err) {
    // err.status = 500;
    err.message = `Could not update feedback item with id ${req.params.id}`;
    next(err);
  }
});

//deletes a feedback item in db
app.delete("/feedback/:id", async (req, res) => {
  try {
    const deletedFeedback = await FeedbackModel.findOneAndRemove(
      req.params.id,
      req.body
    );
    res.status(200).send(deletedFeedback);
  } catch (err) {
    // err.status = 500;
    err.message = `Could not delete feedback item with id ${req.params.id}`;
    next(err);
  }
});

const generateToken = user =>
  jwToken.sign(
    { sub: user.id, iat: new Date().getTime(), user: user.username },
    "a-secret-key",
    { expiresIn: "1h" }
  );

app.use(express.json());
// app.use(express.static("public"));
// app.use(cors());

app.get("/jwt", (req, res) => {
  res.send("Token route is working").status(200);
});

app.post("/jwt/login", (req, res) => {
  const { username, password } = req.body;
  const foundUser = UserModel.findOne({ username, password });
  if (foundUser) {
    const jwt = generateToken(foundUser);
    res.cookie("JWT", jwt);
    res.json({ username: foundUser.username, token: jwt });
  } else {
    res.sendStatus(401);
  }
});

app.post("/jwt/logout", (req, res) => {});

// //returns a list of all users of the app
// app.get('/user', async (req, res, next) => {
//     const foundUser = await UserModel.find().catch(err => {
//     err.status = 400;
//     err.message = `Could not return all users`;
//     next(err);
//   });
//   res.status(200).send(foundUser);
// })

// //updates an existing feedback item in db
// app.put("/user/:userId/feedback/:feedbackId", async (req, res, next) => {
//   try {
//     const updatedFeedback = await findOneAndUpdate(req.params.id, req.body);
//     res.status(200).send(updatedFeedback);
//   } catch (err) {
//     err.status = 500;
//     err.message = `Could not update feedback item with id ${req.params.id}`;
//     next(err);
//   }
// });

//Error handler
//use try-catch if error handler is not last function that is executed
app.use((err, req, res, next) => {
  if (!err.message) {
    return res
      .status(500)
      .send("Error: something unexpected has happened. Error has no handler.");
  }
  return res.status(400).send({ message: err.message });
});

module.exports = app;
