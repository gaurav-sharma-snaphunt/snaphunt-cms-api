const mongoose = require("mongoose");

const useCaseSchema = mongoose.Schema({
  text: { type: String, required: true },
  isRemoved: { type: Boolean, required: true },
  timeStamp: { type: Date, default: Date.now },
  session: { type: String, required: true },
  category: { type: String, required: true },
  srcId: { type: String, required: true },
});

const UseCaseModel = mongoose.model("UseCase", useCaseSchema); //what is the relation between "Feedback" and FeedbackModel?

module.exports = UseCaseModel;
