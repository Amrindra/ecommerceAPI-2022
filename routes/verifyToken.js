const jwt = require("jsonwebtoken");

//To verify a user if they are the right user
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) res.status(403).json("Token is not valid!");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    //checking to see if they're the right user to udpate this information
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not authorized!");
    }
  });
};

//Verifying token for admin
const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    //checking to see if this user is an admin
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not authorized! Admin Only!");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
