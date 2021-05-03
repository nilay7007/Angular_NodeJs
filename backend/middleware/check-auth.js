const jwt = require("jsonwebtoken");
//its just a middleware which gets parsed with every inconig requests
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    //.verify can also give error so all these are inside try block
    //.verify also gives us a decoded token
    const decodedToken = jwt.verify(token, "secret_this_should_be_longer");
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    //adding new data to req...now it will get attached to it
    next();
  } catch (error) {
    res.status(401).json({ message: "You are not authenticated!" });
  }
};
