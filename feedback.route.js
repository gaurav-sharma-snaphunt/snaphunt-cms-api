const express = require("express");
const router = express.Router();
const FeedbackModel = require("./feedback.model");
const feedbackMethod = require("./feedback.methods");
const jwToken = require("jsonwebtoken");

// returns array of all feedback items in db
router.get("/", async (req, res, next) => {
  const { JWT } = req.cookies;
  let decodedToken;
  try {
    decodedToken = await jwToken.verify(JWT, "a-secret-key");
  } catch (err) {
    // err.status = 401;
    err.message = `unauthorized. Log in details are incorrect. (Token is ${decodedToken})`;
    return next(err);
  }

  if (!decodedToken) {
    throw new Error(`decodedToken is invalid. (Token is ${decodedToken})`);
  }
  const foundFeedback = await FeedbackModel.find().catch(err => {
    // err.status = 400;
    err.message = `Could not return all feedback items`;
    next(err);
  });
  res.status(200).send(foundFeedback);
});

//creates a new feedback item in db
router.post("/", async (req, res, next) => {
  try {
    await feedbackMethod.createOne(req.body);
    res.status(200).send(`feedback successfully added: ${req.body.text}`);
  } catch (err) {
    // err.status = 500;
    err.message = `Could not add feedback <<${req.body.text}>>`;
    next(err);
  }
});

//updates an existing feedback item in db
router.put("/:id", async (req, res, next) => {
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
router.delete("/:id", async (req, res, next) => {
  try {
    const deletedFeedback = await FeedbackModel.findOneAndRemove(
      req.params.id,
      req.body
    );
    res.status(200).send(deletedFeedback);
  } catch (err) {
    // err.status = 500;
    err.message = `Could not delete feedback item with id ${req.params.id}`;
    return next(err);
  }
});

module.exports = router;
