const mongoose = require("mongoose");
const SessionModel = require("../models/session.model");

module.exports.createOne = async item => {
  const sessionItem = new SessionModel(item);
  return await sessionItem.save();
};
