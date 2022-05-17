//Using Router function from express
const router = require("express").Router();
const {
  verifyTokenAndAdmin,
  verifyToken,
  verifyTokenAndAuthorization,
} = require("./verifyToken");
// const CryptoJS = require("crypto-js");
const Order = require("../models/Order");

//CREATE ORDER. EVERYONE CAN CREATE ORDER
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Update Order
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        //Take everything inside req.body and then set/update them
        $set: req.body,
      },
      //To make it work we have to add new:true
      { new: true }
    );

    //Sending updated response back to user if there is no any errors
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});

//DELETE ORDER. ONLY ITS USER WHO CAN DELETE ITS OWN CART
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted!");
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET USER ORDERS
//verifyTokenAndAuthorization = only right user who can search their own orders.
//Search by userId instead of actaul id
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Cart.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL ORDERS. ONLY ADMIN CAN REACH THIS DATA
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {}
});

//GET MONTHLY INCOME AND ONLY ADMIN CAN REACH THIS DATA
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const currentDate = new Date();
  const lastMonth = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const getIncome = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(getIncome);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
