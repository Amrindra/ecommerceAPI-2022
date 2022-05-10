//This route is used for user authentication
const User = require("../models/User");
const router = require("express").Router();
const CryptoJS = require("crypto-js");

//REGISTER Route
router.post("/register", async (req, res) => {
  //Creating new users to database by using User model
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    //Encrypting password using crypto-js npm library
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_SECRET_KEY
    ).toString(),
  });

  //Whenever we perform CRUD we should use async await to handle promise
  try {
    const savedUser = await newUser.save();
    //sending savedUser to the client side. 201 it means user is successfully created and added to database
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json(error);
  }
});
module.exports = router;
