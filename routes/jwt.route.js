const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model");
const jwToken = require("jsonwebtoken");

const generateToken = user => {
  return jwToken.sign(
    {
      sub: user.id,
      iat: new Date().getTime()
    },
    "a-secret-key",
    { expiresIn: "1h" } //token expires in 1 hour.
  );
};

//returns Token route is working
router.get("/", (req, res) => {
  res.json("Token route is working").status(200);
});

//logs valid user into app based on user's username and password
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const foundUser = await UserModel.findOne({ username, password });
    console.log("founduser", foundUser);
    if (foundUser) {
      const jwt = await generateToken(foundUser);
      // res.cookie("JWT", jwt, { expires: new Date(Date.now() + 1000 * 60 * 15) }); //cookie expires in 15 minutes, makes cookie persistent.
      return res.status(200).send({ username: foundUser.username, token: jwt });
    } else {
      console.log("entered else block");
      throw new Error("User not found");
    }
  } catch (err) {
     next(err);
  }
});

module.exports = router;
