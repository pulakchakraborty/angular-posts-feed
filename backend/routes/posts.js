const express = require('express');
const Post = require('../models/post');

const router = express.Router();

router.post("", (req, res, next) => {
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

router.put("/:id", (req, res, next) => {
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

router.get("", (req, res, next) => {
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
router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  });
});

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({
      message: 'the selected post has been deleted!!!'
    });
  });
});

module.exports = router;
