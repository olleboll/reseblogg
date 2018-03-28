'use strict';

const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  return res.sendFile('index.html');
});

router.get('/posts', (req, res, next) => {
  console.log("getting posts")
  return res.json({
    status: "ok",
    posts: []
  })
})

router.post('/posts', (req, res, next) => {
  console.log("posting a post")
  return res.json({
    status: "ok",
    post: {}
  })
})

module.exports = router;
