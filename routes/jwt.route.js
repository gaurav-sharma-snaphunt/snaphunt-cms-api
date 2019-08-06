const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model");
const jwToken = require("jsonwebtoken");
const { bcryptLogin, bcryptSignup } = require("../methods/users.methods");

const generateToken = userId => {
  return jwToken.sign(
    {
      sub: userId,
      iat: new Date().getTime()
    },
    "a-secret-key",
    { expiresIn: '1h' } //token expires in 1 hour
  );
};

router.get("/", (req, res) => {
  res.json("Token route is working").status(200);
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const foundUser = await bcryptLogin({ username, password });
    if (foundUser) {
      const jwt = await generateToken(foundUser._id);
      // res.cookie("JWT", jwt, { expires: new Date(Date.now() + 1000 * 60 * 15) }); //cookie expires in 15 minutes, makes cookie persistent.
      return res.status(200).send({ username: foundUser.username, token: jwt });
    } else {
      throw new Error("User not found");
    }
  } catch (err) {
    err.status = 401;
    next(err);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    const existingUser = await UserModel.findOne({
      username: req.body.username
    });
    if (existingUser) {
      throw new Error("Username already exists")
    }
    const newUser = await bcryptSignup(req.body);
    const foundNewUser = await UserModel.findOne({
      username: req.body.username
    });
    if (newUser && foundNewUser) {
      const jwt = await generateToken(foundNewUser._id);
      // res.cookie("JWT", jwt, { expires: new Date(Date.now() + 1000 * 60 * 15) }); //cookie expires in 15 minutes, makes cookie persistent.
      return res
        .status(200)
        .send({ username: foundNewUser.username, token: jwt });
    } else {
      throw new Error("User not found");
    }
  } catch (err) {
    err.status = 401;
    next(err);
  }
});

module.exports = router;
