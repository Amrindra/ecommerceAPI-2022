//Using Router function from express
const router = require("express").Router();
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

// const CryptoJS = require("crypto-js");
const User = require("../models/User");

//Update
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  //Before updating check the password and ecrypt that password once again
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_SECRET_KEY
    ).toString();
  }

  //After checking password and ecrypted from the above. It's time to find user by id then update
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        //Take everything inside req.body and then set/update them
        $set: req.body,
      },
      //To make it work we have to add new:true
      { new: true }
    );

    //Sending updated response back to user if there is no any errors
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted!");
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET USER
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    // const { password, ...others } = user._doc;
    // res.status(200).json(others);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL USERS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
