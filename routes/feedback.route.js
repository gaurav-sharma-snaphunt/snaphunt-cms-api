const express = require("express");
const router = express.Router();
const FeedbackModel = require("../models/feedback.model");
const UserModel = require("../models/user.model");
const feedbackMethod = require("../methods/feedback.methods");
const jwToken = require("jsonwebtoken");

const authenticate = async reqHeaderAuthorization => {
  let decodedToken;
  let result = reqHeaderAuthorization.split(" ")[1];
  if (result === "null") {
    throw new Error("Not logged in");
  }
  try {
    decodedToken = await jwToken.verify(result, "a-secret-key");
    return decodedToken;
  } catch (err) {
    throw new Error("Session expired");
  }
};

// returns array of all feedback items in db
// permissions: S,I
router.get("/", async (req, res, next) => {
  console.log("entered get/feedback");
  try {
    let decodedToken = await authenticate(req.headers.authorization);
    const foundUser = await UserModel.findOne({ _id: decodedToken.sub });
    console.log("get/Feedback API was called");
    const foundFeedback = await FeedbackModel.find({ isRemoved: false });
    return res.status(200).json({fbItems: foundFeedback, userRole: foundUser.role, userName: foundUser.name, userId: foundUser.id});
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
    if (foundUser.role === "Student") {
      newItem = { ...newItem, srcId: decodedToken.sub, isRemoved: false };
      await feedbackMethod.createOne(newItem);
      return res
        .status(200)
        .send(`feedback successfully added: ${newItem.text}`);
    } else {
      throw new Error(`Only students can write feedback`);
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
router.delete("/", async (req, res, next) => {
  console.log("delete API has been called");
  let deletedFeedback;
  try {
    let decodedToken = await authenticate(req.headers.authorization);
    const feedbackItemToDelete = await FeedbackModel.findOne({ 
      srcId: decodedToken.sub, text: req.body.text, category: req.body.category
    });
    console.log(feedbackItemToDelete)
    if (feedbackItemToDelete) {
      deletedFeedback = await FeedbackModel.findOneAndDelete({
        _id: feedbackItemToDelete._id
      });
      res
        .status(200)
        .send(`Successfully deleted feedback item ${deletedFeedback.text}`);
    } else {
      throw new Error("Can only delete your own feedback");
    }
  } catch (err) {
    return next(err);
  }
});

//archives all open feedback items
// permissions: I
router.post("/archive", async (req, res, next) => {
  try {
    let decodedToken = await authenticate(req.headers.authorization);
    const foundUser = await UserModel.findOne({ _id: decodedToken.sub });
    if (foundUser.role === "Instructor") {
      await FeedbackModel.updateMany(
        { isRemoved: false },
        { $set: { isRemoved: true } }
      );
      res.status(200).send(`successfully compiled feedback from current session`)
    } else {
      res.status(403).send(`Only instructors can archive feedback`)
    }
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
