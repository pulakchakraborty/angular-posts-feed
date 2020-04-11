const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

/* use mongoose to connect to the MongoDB Atlas cloud cluster
   - change parameters of connect method as necessary ;-)
*/

mongoose.connect("mongodb+srv://<user>:<password>@cluster0-mfoq8.mongodb.net/Angular-MEAN-App")
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

app.post("/api/posts", (req, res, next) => {
  // const post = req.body;
  // Creating a Post instance managed by mongoose
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  // Saving the data from incoming POST request into post collection
  post.save().then(createdPost => {
    console.log('Incoming post request received');
    console.log(post);
    res.status(201).json({
      message: 'This is a quick ack to the sent request',
      postId: createdPost._id
    });
  });
});

app.put("/api/posts/:id", (req, res, next) => {
  // Creating a Post instance managed by mongoose
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });

  // Updating the resource using the data from incoming PUT request
  Post.updateOne({_id: req.params.id}, post).then(result => {
    console.log(result);
    res.status(200).json({
      message: 'Post update successful :-)'
    });
  });
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

// Fetch post details for a particular post id
app.get("/api/posts/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  });
});

app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({
      message: 'the selected post has been deleted!!!'
    });
  });
});

module.exports = app;
