

// returns array of all feedback items in db
app.get("/feedback", async (req, res, next) => {
  const jwt = sessionStorage.getItem("JWT");
  req.headers.Authorization = "Bearer " + jwt;

  const foundFeedback = await FeedbackModel.find().catch(err => {
    err.status(400);
    err.message = `Could not return all feedback items`;
    next(err);
  });
  res.status(200).send(foundFeedback);
});

//creates a new feedback item in db
app.post("/feedback", async (req, res, next) => {
  try {
    await feedback.createOne(req.body);
    res.status(200).send(`feedback successfully added: ${req.body.text}`);
  } catch (err) {
    err.status(500);
    err.message = `Could not add feedback <<${req.body.text}>>`;
    next(err);
  }
});

//updates an existing feedback item in db
app.put("/feedback/:id", async (req, res, next) => {
  try {
    const updatedFeedback = await findOneAndUpdate(req.params.id, req.body);
    res.status(200).send(updatedFeedback);
  } catch (err) {
    err.status(500);
    err.message = `Could not update feedback item with id ${req.params.id}`;
    next(err);
  }
});

//deletes a feedback item in db
app.delete("/feedback/:id", async (req, res) => {
  try {
    const deletedFeedback = await findOneAndRemove(req.params.id, req.body);
    res.status(200).send(deletedFeedback);
  } catch (err) {
    err.status(500);
    err.message = `Could not delete feedback item with id ${req.params.id}`;
    next(err);
  }
});
