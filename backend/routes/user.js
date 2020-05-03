const express = require("express");
const bcrypt = require("bcrypt");

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

module.exports = router;
