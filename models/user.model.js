const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
});

const UserModel = mongoose.model("User", userSchema); //what is the relation between "Feedback" and FeedbackModel?

module.exports = UserModel;
