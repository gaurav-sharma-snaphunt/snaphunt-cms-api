const express = require("express");
const router = express.Router();
const FeedbackModel = require("../models/feedback.model");
const UserModel = require("../models/user.model");
const feedbackMethod = require("../methods/feedback.methods");
const jwToken = require("jsonwebtoken");

//cookie-parser is called in app.js

const authenticate = async cookie => {
  const { JWT } = cookie;
  return await jwToken.verify(JWT, "a-secret-key");
};

// returns array of all feedback items in db
// permissions: S,I
router.get("/", async (req, res, next) => {
  let decodedToken;
  let result;
  try {
    result = req.headers.Authorization.split(" ")[1];
    if (result) {
      decodedToken = jwToken.verify(result, "a-secret-key");
    }
  } catch (err) {
    err.message = `Unauthorized. Log in details are incorrect.`;
    return next(err);
  }
  if (!decodedToken) {
    throw new Error(`decodedToken is invalid. (Token is ${decodedToken})`);
  }
  const foundFeedback = await FeedbackModel.find({ isRemoved: false }).catch(err => {
    err.message = `Could not return all feedback items`;
    return next(err);
  });

  return res.status(200).json(foundFeedback);
});

//creates a new feedback item in db
// permissions: S
router.post("/", async (req, res, next) => {
  let decodedToken;
  try {
    decodedToken = await authenticate(req.cookies);
    if (decodedToken) {
      const foundUser = await UserModel.findOne({ _id: decodedToken.sub });
      if (foundUser.role === "Student") {
        await feedbackMethod.createOne(req.body);
      } else {
        return res.status(401).send(`Only students can write feedback`);
      }
    }
  } catch (err) {
    // err.message = `unauthorized. Log in details are incorrect.`;
    return next(err);
  }
  return res.status(200).send(`feedback successfully added: ${req.body.text}`);
});

//updates an existing feedback item in db
// permissions: S(self)
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
// permissions: S(self)
router.delete("/:id", async (req, res, next) => {
  let decodedToken;
  let deletedFeedback;
  try {
    decodedToken = await authenticate(req.cookies);
    if (decodedToken) {
      const deletedFeedback = await FeedbackModel.findOneAndRemove(
        req.params.id
      );
    }
  } catch (err) {
    // err.status = 500;
    // err.message = `Could not delete feedback item with id ${req.params.id}`;
    return next(err);
  }
  res
    .status(200)
    .send(`Successfully deleted feedback item ${deletedFeedback.text}`);
});

//archives all open feedback items
// permissions: I
router.post("/archive", (req, res) => {});

module.exports = router;
