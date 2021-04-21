const jwt = require("jsonwebtoken");
//its just a middleware which gets parsed with every inconig requests
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    //.query can also give error so all these are inside try block
    jwt.verify(token, "secret_this_should_be_longer");
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed!" });
  }
};
