const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const postRoutes = require('./routes/posts');

const app = express();

// Replace with your mongoLab URI
const MONGO_URI = `mongodb+srv://${process.env.MONGO_ATLAS_USERNAME}:${process.env.MONGO_ATLAS_PASSWORD}@${process.env.MONGO_ATLAS_CLUSTER}`;

/* use mongoose to connect to the MongoDB Atlas cloud cluster
   - change parameters of connect method as necessary ;-)
*/
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to Atlas cloud :-)');
  })
  .catch(() => {
    console.log('Connection to Atlas cloud failed!!!');
  });

// add a new middleware to parse the json data present in the incoming request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// add a new middleware to make /images statically accessible
app.use("/images", express.static(path.join("images")));

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
