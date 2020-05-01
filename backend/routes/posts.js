const express = require('express');
const multer = require('multer');
const Post = require('../models/post');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png' : 'png',
  'image/jpeg': 'jpg',
  'image/jpg' : 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid Mime Type");
    if (isValid) {
      error = null;
    }
    cb(error, "images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post("", multer({storage: storage}).single("image"), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  // const post = req.body;
  // Creating a Post instance managed by mongoose
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename
  });
  // Saving the data from incoming POST request into post collection
  post.save().then(createdPost => {
    console.log('Incoming post request received');
    console.log(post);
    res.status(201).json({
      message: 'This is a quick ack to the sent request',
      post: {
        ...createdPost,
        id: createdPost._id,
      }
    });
  });
});

router.put("/:id", multer({storage: storage}).single("image"), (req, res, next) => {
  // Creating a Post instance managed by mongoose
  console.log(req.file);
  let imagePath = req.body.imagePath
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath =  url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  console.log(post);
  // Updating the resource using the data from incoming PUT request
  Post.updateOne({_id: req.params.id}, post).then(result => {
    console.log(result);
    res.status(200).json({
      message: 'Post update successful :-)'
    });
  });
});

router.get("", (req, res, next) => {
  const { pagesize, page } = req.query;
  const [ pageSize , currentPage ] = [ +pagesize, +page ];
  const postQuery = Post.find();
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  // Fetch the data from the MongoDB database using static find() method
  postQuery.then(documents => {
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
