const router = require("express").Router();
const stripe = require("stripe");

router.apply("/payment", (req, res) => {
  //Creating stripe payment
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd",
    },
    (stripeErr, stripeRes) => {
      if (!stripeErr) {
        res.status(200).json(stripeRes);
      } else {
        res.staus(500).json(stripeErr);
      }
    }
  );
});

module.exports = router;
