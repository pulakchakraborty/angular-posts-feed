const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const router = express.Router();

// Register the routes
router.post("/signup", (req, res, next) => {
  // create new user and store it to database
  console.log("incoming request");
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(result => {
          res.status(201).json({ result, message: 'User is created' });
        })
        .catch(error => {
          res.status(500).json({ error });
        });
    });
});

router.post("/login", (req, res, next) => {
  // Authentication logic
  let fetchedUser;
  User.findOne({ email: req.body.email }).then(user => {
    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);
  })
  .then(result => {
    if (!result) {
      return res.status(401).json({ message: "Authentication failed" });
    }
    const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id },
      "secret_key_changeInProd",
      { expiresIn: "1h" });
    res.status(200).json({ token });
  })
  .catch(error => {
    return res.status(401).json({ error, message: "Authentication failed" });
  })
});

module.exports = router;
