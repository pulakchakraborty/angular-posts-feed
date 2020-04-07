const express = require('express');

const app = express();

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

app.use("/api/posts", (req, res, next) => {
  const posts = [
    {
      id: "ABC1000001",
      title: "First Post from server",
      content: "The content of the first post"
    },
    {
      id: "ABC1000002",
      title: "Second Post from server",
      content: "The content of the second post"
    },
    {
      id: "ABC1000003",
      title: "Third Post from server",
      content: "The content of the third post"
    }
  ];
  res.status(200).json({
    message: 'the posts from the server are fetched successfully!!',
    posts: posts
  });   // return to the client
});

module.exports = app;
