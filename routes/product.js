//Using Router function from express
const router = require("express").Router();
<<<<<<< HEAD
const { verifyTokenAndAdmin } = require("./verifyToken");
=======
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin
} = require("./verifyToken");
>>>>>>> d23186e8c0880413183a57231d9cc960bf3e5db1

// const CryptoJS = require("crypto-js");
const Product = require("../models/Product");

//CREATE PRODUCT and ONLY ADMIN CAN CREATE PRODUCT
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Update Product
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        //Take everything inside req.body and then set/update them
        $set: req.body
      },
      //To make it work we have to add new:true
      { new: true }
    );

    //Sending updated response back to user if there is no any errors
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json(error);
  }
});

//DELETE PRODUCT
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted!");
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET SINGLE PRODUCT
//In this case, users, admin, and guests can find products, so we don't have to pass "veryfyToken" middleware
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

<<<<<<< HEAD
//GET ALL USERS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;

  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    res.status(200).json(users);
=======
//GET ALL PRODUCT
router.get("/", async (req, res) => {
  const queryNew = req.query.new;
  const queryCategory = req.query.category;

  try {
    res.status(200).json();
>>>>>>> d23186e8c0880413183a57231d9cc960bf3e5db1
  } catch (error) {
    res.status(500).json(error);
  }
});

//USER STATS
//Using this stat to return total users per month. EX: number of users have registered....
// router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
//   const date = new Date();
//   const lastyear = new Date(date.setFullYear(date.getFullYear() - 1));

//   try {
//     const data = await User.aggregate([
//       { $match: { createdAt: { $gte: lastyear } } },
//       {
//         $project: {
//           //take only month from createdAt in database then store it in month variable
//           month: { $month: "$createdAt" },
//         },
//       },
//       {
//         $group: {
//           _id: "$month",
//           total: { $sum: 1 },
//         },
//       },
//     ]);
//     res.status(200).json(data);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

module.exports = router;
