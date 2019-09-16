const express = require("express");
const app = express();
// var cookieParser = require("cookie-parser");
const useCaseRouter = require("./routes/useCase.route");

const cors = require("cors");

const corsOptions = {
	origin: [
		/\.herokuapp\.com$/,
		/\.netlify\.com$/,
		"http://localhost:3000",
		"http://localhost:3001"
	], //whitelisted domains
	preflightContinue: false,
	optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

app.use(express.json());
// app.use(cookieParser());

app.use("/useCase", useCaseRouter);

//returns Hello World
app.get("/", (req, res) => {
	res.status(200).send("Hello World");
});

app.use((err, req, res, next) => {
	console.log("--app.js--error handler was called");
	if (!err.message) {
		return res.send("Error: something unexpected has happened.");
	}
	console.log("err.message", err.message);
	if (!err.status) {
		return res.status(500).send(err.message);
	}
	return res.status(err.status).send(err.message);
});

module.exports = app;
