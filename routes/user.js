//Using Router function from express
const router = require("express").Router();
const { verifyToken, verifyTokenAndAuthorization } = require("./verifyToken");
const CryptoJS = require("crypto-js");
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
        //Setting information
        $set: req.body,
      },
      //To make it work we have to add new:true
      { new: true }
    );

    //Sending response back to user if there is no any errors
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
