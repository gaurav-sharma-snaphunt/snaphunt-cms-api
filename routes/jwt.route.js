const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model");
const jwToken = require("jsonwebtoken");

//cookie parser is called in app.js

const generateToken = user => {
  return jwToken.sign(
    {
      sub: user.id,
      iat: new Date().getTime()
    },
    "a-secret-key",
    { expiresIn: "1h" } //token expires in 1 hour. Not limiting factor as cookie expires in 15 minutes.
  );
};

//returns Token route is working
router.get("/", (req, res) => {
  res.send("Token route is working").status(200);
});

//logs valid user into app based on user's username and password
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await UserModel.findOne({ username, password });
  if (foundUser) {
    const jwt = await generateToken(foundUser);
    res.cookie("JWT", jwt, { expires: new Date(Date.now() + 1000 * 60 * 15) }); //cookie expires in 15 minutes, makes cookie persistent.
    return res.status(200).json({ username: foundUser.username, token: jwt });
  } else {
    return res.status(401).json("User not found");
  }
});

//logs user out of app
router.post("/logout", (req, res, next) => {
  try {
    res.clearCookie("JWT");
  } catch (err) {
    err.message = `Unable to log out as jwt cookie could not be cleared.`;
    return next(err);
  }
  res.status(200).json("Logged out successfully");
});

module.exports = router;
