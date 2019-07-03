const express = require("express");
const app = express();
const FeedbackModel = require("./feedback.model");
const UserModel = require("./user.model");
const feedback = require("./feedback");

app.use(express.json());

//returns Hello World
app.get("/", (req, res, next) => {
  res
    .status(200)
    .send("Hello World")
    .catch(err => {
      err.status(400);
      err.message = `Could not return hello world`;
      next(err);
    });
});

// returns array of all feedback items in db
app.get("/feedback", async (req, res, next) => {
  const jwt = sessionStorage.getItem("JWT");
  req.headers.Authorization = "Bearer " + jwt;

  const foundFeedback = await FeedbackModel.find().catch(err => {
    err.status(400);
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
    err.status(500);
    err.message = `Could not add feedback <<${req.body.text}>>`;
    next(err);
  }
});

//updates an existing feedback item in db
app.put("/feedback/:id", async (req, res, next) => {
  try {
    const updatedFeedback = await findOneAndUpdate(req.params.id, req.body);
    res.status(200).send(updatedFeedback);
  } catch (err) {
    err.status(500);
    err.message = `Could not update feedback item with id ${req.params.id}`;
    next(err);
  }
});

//deletes a feedback item in db
app.delete("/feedback/:id", async (req, res) => {
  try {
    const deletedFeedback = await findOneAndRemove(req.params.id, req.body);
    res.status(200).send(deletedFeedback);
  } catch (err) {
    err.status(500);
    err.message = `Could not delete feedback item with id ${req.params.id}`;
    next(err);
  }
});

//returns a list of all users of the app
app.get('/user', async (req, res, next) => {
    const foundUser = await UserModel.find().catch(err => {
    err.status(400);
    err.message = `Could not return all users`;
    next(err);
  });
  res.status(200).send(foundUser);
})

//updates an existing feedback item in db
app.put("/user/:id/feedback/:id", async (req, res, next) => {
  try {
    const updatedFeedback = await findOneAndUpdate(req.params.id, req.body);
    res.status(200).send(updatedFeedback);
  } catch (err) {
    err.status(500);
    err.message = `Could not update feedback item with id ${req.params.id}`;
    next(err);
  }
});

//Error handler
//use try-catch if error handler is not last function that is executed
app.use((err, req, res, next) => {
  if (!err.statusCode) {
    return res
      .status(400)
      .send("Error: something unexpected has happened. Error has no handler.");
  }
  return res.status(err.stausCode).send({ message: err.message });
});

module.exports = app;
