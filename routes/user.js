//Using Router function from express
const router = require("express").Router();

router.get("/usertest", (req, res) => {
  res.send("Test successfully");
});

router.post("/userpost", (req, res) => {
  const username = req.body.username;
  res.send("Username: " + username);
});

module.exports = router;
