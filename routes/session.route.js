const express = require("express");
const router = express.Router();
const SessionModel = require("../models/session.model");
const UserModel = require("../models/user.model");
const sessionMethod = require("../methods/session.methods");
const authenticate = require("../authenticate");

router.get("/", async (req, res, next) => {
  try {
    await authenticate(req.headers.authorization);
    const foundSession = await SessionModel.find();
    const foundUserId = await UserModel.findOne({ _id: foundSession[0].srcId });
    return res.status(200).send({
      session: foundSession[0].thisSession,
      instructor: foundUserId.name
    });
  } catch (err) {
    return next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const decodedToken = await authenticate(req.headers.authorization);
    const foundUser = await UserModel.findOne({ _id: decodedToken.sub });
    if (foundUser.role === "Instructor") {
      const sessionList = await SessionModel.find();
      if (sessionList.length > 0) {
        await SessionModel.findOneAndUpdate(
          { _id: sessionList[0]._id },
          { $set: { thisSession: req.body.session, srcId: decodedToken.sub } }
        );
        return res
          .status(200)
          .send(`Session successfully updated: ${req.body.session}`);
      } else {
        await sessionMethod.createOne({
          thisSession: req.body.session,
          srcId: decodedToken.sub
        });
        return res
          .status(200)
          .send(`Session successfully added: ${req.body.session}`);
      }
    } else {
      throw new Error("Only instructors are allowed to edit this field");
    }
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
