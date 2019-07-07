const mongoose = require("mongoose");

const sessionSchema = mongoose.Schema({
  thisSession: { type: String, required: true },
  // helpFind: { type: Boolean, required: true, default: true },
  srcId: { type: String, required: true }
});

const SessionModel = mongoose.model("Session", sessionSchema);

module.exports = SessionModel;
