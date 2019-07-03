const mongoose = require("mongoose");
// require('feedback.model.js');
// const FeedbackModel = mongoose.model("Feedback");
const FeedbackModel = require("./feedback.model");

module.exports.createOne = async item => {
  const feedbackItem = new FeedbackModel(item);
  return await feedbackItem.save();
};
