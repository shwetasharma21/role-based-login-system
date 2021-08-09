const express = require("express");
const mongoose = require("mongoose");

const userRouter = require("./routes/userRouter");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 9696;

// Connect to the MongoDB cluster
mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) throw err;
    console.log("Mongoose is connected");
  }
);

app.get("/", (req, res) => {
  res.send("Welcome to Role Based Login System");
});

app.use("/api/user", userRouter);

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`Server is listening at port ${port}`);
});
