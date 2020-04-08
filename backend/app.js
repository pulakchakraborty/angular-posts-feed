const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

/* use mongoose to connect to the MongoDB Atlas cloud cluster
   - change parameters of connect method as necessary ;-)
*/

mongoose.connect("mongodb+srv://<username>:<password>@cluster0-mfoq8.mongodb.net/Angular-MEAN-App")
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
    "GET, POST, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  // const post = req.body;
  // Creating a Post instance managed by mongoose
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  // Saving the data from incoming POST request into post collection
  post.save();
  console.log('Incoming post request received');
  console.log(post);
  res.status(201).json({
    message: 'This is a quick ack to the sent request'});
});

app.get("/api/posts", (req, res, next) => {
  // Fetch the data from the MongoDB database using static find() method
  Post.find().then(documents => {
    console.log(documents);
    res.status(200).json({
      message: 'the posts from the server are fetched successfully!!',
      posts: documents
    });   // return to the client
  });

});

module.exports = app;
