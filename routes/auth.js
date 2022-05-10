//This route is used for user authentication
const User = require("../models/User");
const router = require("express").Router();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//REGISTER ROUTE
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

//LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {
    //Finding user in the database then store that user in the user variable once found
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      res.status(401).json("Wrong credentials!");
    }

    //decrypting user password then store it in hashedPassword
    const hashedPassword = CryptoJS.AES.decrypt(
      //user.password is from line 33. we use that user variable to access password
      user.password,
      process.env.PASSWORD_SECRET_KEY
    );
    //converting hashedPassword to string type then store it in password variable
    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    //Checking if password user types in doesn't match to password in database, send message back
    if (originalPassword !== req.body.password) {
      res.status(401).json("Wrong Credentials!");
    }

    //Using spread operator to take out only password because we don't want to have password show in the database it's for safety
    //By implementing this, password won't show in the DB. Even though password has been hashed, but we shouldn't reveal password in the DB
    //_doc is from DB,
    const { password, ...others } = user._doc;

    //if everything matches send the rest of other data except password json back
    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
