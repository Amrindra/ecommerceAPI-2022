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

//GET SINGLE USER
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    //By extracting {passord, ...others} because we wanted to send password to client side.
    const { password, ...others } = user._doc;
    res.status(200).json(others);
    // res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL USERS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  //using query to limit how many users we want to return back
  const query = req.query.new;

  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

//USER STATS
//Using this stat to return total users per month. EX: number of users have registered....
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastyear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastyear } } },
      {
        $project: {
          //take only month from createdAt in database then store it in month variable
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
