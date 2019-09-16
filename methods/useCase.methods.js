require("mongoose");
const UseCaseModel = require("../models/useCase.model");

module.exports.createOne = async item => {
  const useCaseItem = new UseCaseModel(item);
  return await useCaseItem.save();
};