const { verifyToken } = require("./verifyToken");

//Using Router function from express
const router = require("express").Router();

router.put("/id:", verifyToken, (req, res) => {});

module.exports = router;
