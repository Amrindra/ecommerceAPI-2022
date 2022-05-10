//

const User = require("../models/User");

const router = require("express").Router();

//REGISTER Route
router.post("/register", async (req, res) => {
  //Creating new users to database by using User model
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
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
