const express = require("express");
const router = express.Router();
const UseCaseModel = require("../models/useCase.model");
const authenticate = require("../authenticate");

router.get("/", async (req, res, next) => {
  return res.status(200).send("useCase route is working")
})


// // permissions: S,I
// router.get("/", async (req, res, next) => {
//   try {
//     if (!req.headers.authorization) {
//       throw new Error("Please log in");
//     }
//     let decodedToken = await authenticate(req.headers.authorization);
//     const foundUser = await UserModel.findOne({ _id: decodedToken.sub });
//     if (!foundUser) {
//       throw new Error("Could not find user");
//     }
//     const foundFeedback = await FeedbackModel.find({ isRemoved: false });
//     return res.status(200).json({
//       items: foundFeedback,
//       userRole: foundUser.role,
//       userName: foundUser.name,
//       userId: foundUser.id
//     });
//   } catch (err) {
//     return next(err);
//   }
// });

// // permissions: S
// router.post("/", async (req, res, next) => {
//   let newItem = req.body;
//   try {
//     let decodedToken = await authenticate(req.headers.authorization);
//     const foundUser = await UserModel.findOne({ _id: decodedToken.sub });
//     if (foundUser.role === "Student") {
//       newItem = { ...newItem, srcId: decodedToken.sub, isRemoved: false };
//       await feedbackMethod.createOne(newItem);
//       console.log("succ add fb")
//       return res
//         .status(200)
//         .send(`Successfully added feedback: "${newItem.text.slice(0, 10)}..."`);
//     } else {
//       throw new Error("Only students can write feedback");
//     }
//   } catch (err) {
//     return next(err);
//   }
// });

// // permissions: S(self)
// router.put("/", async (req, res, next) => {
//   let updatedFeedback;
//   try {
//     let decodedToken = await authenticate(req.headers.authorization);
//     const feedbackItemToUpdate = await FeedbackModel.findOne({
//       srcId: decodedToken.sub,
//       text: req.body.oldtext,
//       category: req.body.category
//     });
//     if (feedbackItemToUpdate) {
//       updatedFeedback = await FeedbackModel.findOneAndUdate(
//         { _id: feedbackItemToUpdate._id },
//         { text: req.body.newText },
//         { new: true }
//       );
//       res
//         .status(200)
//         .send(
//           `Successfully updated feedback: "${updatedFeedback.text.slice(
//             0,
//             10
//           )}..."`
//         );
//     } else {
//       throw new Error("Can only edit your own feedback");
//     }
//   } catch (err) {
//     return next(err);
//   }
// });

// // permissions: S(self)
// router.delete("/", async (req, res, next) => {
//   console.log("headers.auth", req.headers.authorization)
//   console.log("body", req.body)
//   let deletedFeedback;
//   try {
//     let decodedToken = await authenticate(req.headers.authorization);
//     const feedbackItemToDelete = await FeedbackModel.findOne({
//       srcId: decodedToken.sub,
//       text: req.body.text,
//       category: req.body.category
//     });
//     if (feedbackItemToDelete) {
//       deletedFeedback = await FeedbackModel.findOneAndDelete({
//         _id: feedbackItemToDelete._id
//       });
//       res
//         .status(200)
//         .send(
//           `Successfully deleted feedback: ${deletedFeedback.text.slice(
//             0,
//             10
//           )}...`
//         );
//     } else {
//       throw new Error("You may only delete your own feedback");
//     }
//   } catch (err) {
//     return next(err);
//   }
// });

// // permissions: I
// router.put("/archive", async (req, res, next) => {
//   try {
//     let decodedToken = await authenticate(req.headers.authorization);
//     const foundUser = await UserModel.findOne({ _id: decodedToken.sub });
//     if (foundUser.role === "Instructor") {
//       await FeedbackModel.updateMany(
//         { isRemoved: false },
//         { $set: { isRemoved: true } }
//       );
//       res
//         .status(200)
//         .send(`successfully compiled feedback from current session`);
//     } else {
//       throw new Error("Only instructors can archive feedback");
//     }
//   } catch (err) {
//     return next(err);
//   }
// });

module.exports = router;
