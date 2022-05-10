const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./routes/user");

//Have to config dotenv in order to use it
dotenv.config();

//if we don't use express.json we won't be able to send post request
app.use(express.json());

app.use("/api/users", userRouter);

app.use("/api/users", userRouter);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB has been connected successfully"))
  .catch((error) => {
    console.log(error);
  });

app.listen(process.env.PORT || 8000, () => {
  console.log("Server is running on port 8000");
});
