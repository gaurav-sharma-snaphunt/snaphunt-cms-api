const { MongoClient } = require("mongodb");
const request = require("supertest");
const mongoose = require("mongoose");
require("../db");
const app = require("../app");

const mockData = {
  text: "I like back-end dev",
  isRemoved: false,
  category: "Good",
  session: "express"
};

describe("Feedback", () => {
  let connection;
  let db;

  beforeAll(async () => {
    const dbParams = global.__MONGO_URI__.split("/");
    const dbName = dbParams[dbParams.length - 1];
    connection = await MongoClient.connect(global.__MONGO_URI__, {
      useNewUrlParser: true
    });
    db = await connection.db(dbName);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await connection.close();
    await db.close();
  });

  beforeEach(async () => {
    await db.dropDatabase();
  });

  it("GET / should return Hello World", async () => {
    const response = await request(app).get("/");

    expect(response.text).toEqual("Hello World");
  });

  describe("/feedback", () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZDIyOTA5NjZlYTQyOTM5NTRlNmFmMGUiLCJpYXQiOjE1NjI1NDg4OTcyNjQsImV4cCI6MTU2MjU0ODkwMDg2NH0.G3sv08vOQdIQ9-XClKj-RxzS8_ZhtrgNPVTXGWfrkHU";

    it("/GET should return all feedback items", async () => {
      const collection = db.collection("feedbacks");
      await collection.insertOne(mockData);

      const response = await request(app)
        .get("/feedback")
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + token);
      console.log("collection", response.body);
      expect(response.body).toEqual(
        `feedback successfully added: ${mockData.text}`
      );
    });

    xit("/POST should create a feedback item", async () => {
      const collection = db.collection("feedback");
      await collection.insertOne(mockData);
      const newData = {
        text: "We can do pair programming!",
        category: "Suggestion",
        session: "Javascript in depth"
      };
      const response = await request(app)
        .post(`/feedback`)
        .send(newData)
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + token);
      expect(response.status).toEqual(200);
      const foundFeedback = await collection.find({
        text: "We can do pair programming!"
      });
      expect(foundFeedback.id).toEqual(newData.id);
    });
  });
});
