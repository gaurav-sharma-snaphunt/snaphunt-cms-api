const mongoose = require("mongoose");

const mongoOptions = {
  useNewUrlParser: true
};

// const dbUrl = global.__MONGO_URI__ || "mongodb://localhost:27017/Feedback"; //Database name
const dbUrl = process.env.__MONGO_URI__ || "mongodb://localhost:27017/Feedback"; //Database name
mongoose.connect(dbUrl, mongoOptions); //establishing connection between server and db
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  //will wait till app is listening
  console.log("connected to mongodb");
});
