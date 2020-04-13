const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postRoutes = require('./routes/posts');

const app = express();

/* use mongoose to connect to the MongoDB Atlas cloud cluster
   - change parameters of connect method as necessary ;-)
*/

mongoose.connect("mongodb+srv://user:password@cluster0-mfoq8.mongodb.net/Angular-MEAN-App")
  .then(() => {
    console.log('Connected to Atlas cloud :-)');
  })
  .catch(() => {
    console.log('Connection to Atlas cloud failed!!!');
  });

// add a new middleware to parse the json data present in the incoming request
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-with, Content-Type, Accept"
  );
  res.setHeader("Access-Control-Allow-Methods",
    "GET, POST, DELETE, PUT, PATCH, OPTIONS"
  );
  next();
});

app.use('/api/posts', postRoutes);

module.exports = app;
