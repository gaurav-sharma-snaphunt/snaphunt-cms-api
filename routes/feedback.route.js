const express = require("express");
const router = express.Router();
const FeedbackModel = require("../models/feedback.model");
const UserModel = require("../models/user.model");
const feedbackMethod = require("../methods/feedback.methods");
const jwToken = require("jsonwebtoken");

const authenticate = async reqHeaderAuthorization => {
  let decodedToken;
  console.log("auth is: ", reqHeaderAuthorization);
  let result = reqHeaderAuthorization.split(" ")[1];
  console.log("result is: ", result);
  if (result == null) {
    console.log("entered result is null block");
    throw new Error("Not logged in");
  }
  try {
    console.log("i have entered");
    decodedToken = await jwToken.verify(result, "a-secret-key");
    return decodedToken;
  } catch (err) {
    throw new Error("Session expired");
  }
};

// returns array of all feedback items in db
// permissions: S,I
router.get("/", async (req, res, next) => {
  try {
    let decodedToken = await authenticate(req.headers.authorization);
    const foundFeedback = await FeedbackModel.find({ isRemoved: false });
    return res.status(200).json(foundFeedback);
  } catch (err) {
    return next(err);
  }
});

//creates a new feedback item in db
// permissions: S
router.post("/", async (req, res, next) => {
  let newItem = req.body;
  try {
    let decodedToken = await authenticate(req.headers.authorization);
    const foundUser = await UserModel.findOne({ _id: decodedToken.sub });
    console.log("foundUser is:", foundUser);
    if (foundUser.role === "Student") {
      newItem = { ...newItem, srcId: decodedToken.sub, isRemoved: false };
      await feedbackMethod.createOne(newItem);
      return res
        .status(200)
        .send(`feedback successfully added: ${newItem.text}`);
    } else {
      return res.status(401).send(`Only students can write feedback`);
    }
  } catch (err) {
    return next(err);
  }
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
