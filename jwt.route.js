const express = require("express");
const router = express.Router();
const UserModel = require("./user.model");
// var cookieParser = require("cookie-parser");
const jwToken = require("jsonwebtoken");

// router.use(cookieParser());

const generateToken = user =>
  jwToken.sign(
    { sub: user.id, iat: new Date().getTime(), user: user.username },
    "a-secret-key",
    { expiresIn: "1h" }
  );

router.get("/", (req, res) => {
  res.send("Token route is working").status(200);
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("req.body is: ", req.body);
  const foundUser = await UserModel.findOne({ username, password });
  console.log("foundUser is: ", foundUser);
  if (foundUser) {
    const jwt = await generateToken(foundUser);
    res.cookie("JWT", jwt);
    return res.json({ username: foundUser.username, token: jwt });
  } else {
    return res.status(401).json("User not found");
  }
});

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
