require("mongoose");
const FeedbackModel = require("../models/feedback.model");

module.exports.createOne = async item => {
  const feedbackItem = new FeedbackModel(item);
  return await feedbackItem.save();
};