const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");
const cors = require("cors");

//Have to config dotenv in order to use it
dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB has been connected successfully"))
  .catch((error) => {
    console.log(error);
  });

app.use(cors);

//if we don't use express.json we won't be able to send post request
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/stripe", stripeRoute);

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server is running on ${process.env.PORT}`);
});
