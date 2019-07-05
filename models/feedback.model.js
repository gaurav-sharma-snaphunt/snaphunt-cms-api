const mongoose = require("mongoose");

const feedbackSchema = mongoose.Schema({
  text: { type: String, required: true },
  isRemoved: { type: Boolean, required: true },
  timeStamp: { type: Date, default: Date.now },
  session: { type: String, required: true },
  category: { type: String, required: true },
  srcId: { type: String, required: true },
});

const FeedbackModel = mongoose.model("Feedback", feedbackSchema); //what is the relation between "Feedback" and FeedbackModel?

module.exports = FeedbackModel;
