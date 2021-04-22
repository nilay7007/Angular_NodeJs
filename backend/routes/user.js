const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const router = express.Router();

router.post("/signup", (req, res, next) => {
  //it takes the value we want to encrypt
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
      //normally password:req.body.passsword is not safe as anyone can then hac k our passord so we use hash to encrypt our password
    });
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: "User created!",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
      //it compares that encyprted generated for those 2 are same or not
      //so it takes from req and other from db and return a promise if treu or false
    })
    .then(result => {
      if (!result) {
        /**
         * The return keyword returns from your function, thus ending its execution. This means that any lines of code after it will not be executed.
In some circumstances, you may want to use res.send and then do other stuff.
         */
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      //jwt.sign has 3 argumennts->1st payload .2nd to verify in server side ...3rd its there
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        "secret_this_should_be_longer",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Auth failed"
      });
    });
});

module.exports = router;
