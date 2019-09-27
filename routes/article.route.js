const express = require("express");
const router = express.Router();
const { createClient } = require("contentful");

const contentfulClient = createClient({
  space: "38i3cuofr9e8",
  accessToken: "q-Xo5ShWRCsOAm6nRy10nYBe6fT4ngYu0s5w0k70uoc"
});
const CONTENTFUL_CONTENT_TYPE = "standardArticle";

router.get("/", async (req, res, next) => {
  return res.status(200).send("article route is working");
});

router.post("/published", async (req, res, next) => {
  try {
    const { skip, limit, category, select } = req.body;
    let input;
    if (select) {
      input = {
        skip,
        limit,
        content_type: CONTENTFUL_CONTENT_TYPE,
        "fields.articleCategory": category,
        order: "-sys.createdAt",
        select: `fields.${select}`
      };
    } else {
      input = {
        skip,
        limit,
        content_type: CONTENTFUL_CONTENT_TYPE,
        "fields.articleCategory": category,
        order: "-sys.createdAt"
      };
    }
    const fetchedData = await contentfulClient.getEntries(input);
    return res.status(200).send(fetchedData.items);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
