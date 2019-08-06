const bcrypt = require("bcrypt");
const saltRounds = 10;
const UserModel = require("../models/user.model");

module.exports.bcryptSignup = async input => {
  const hash = await bcrypt.hash(input.password, saltRounds);
  const newUser = new UserModel({
    username: input.username,
    password: hash,
    role: input.role,
    name: input.name
  });
  return await newUser.save();
};

module.exports.bcryptLogin = async input => {
  const foundUser = await UserModel.findOne({
    username: input.username
  });
  if (!foundUser) {
    throw new Error("Username not found");
  }
  const result = await bcrypt.compare(input.password, foundUser.password);
  if (result) {
    return foundUser;
  } else {
    throw new Error("Incorrect password");
  }
};
