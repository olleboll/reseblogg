'use strict';

const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  return res.sendFile('index.html');
});

router.get('/posts', (req, res, next) => {
  console.log("getting posts")
  const posts = []
  const post = {
    date: new Date(),
    title: "Test wow",
    body: "Idag gjorde sara nått dumt. Hon snubblade på ett bananskal så att hela USA skrattade. \
            Sen snubbladne hon igen och fick banskalet i munnen så hon nästan kräktes.. haha hoho",
  }
  posts.push(post)
  return res.json({
    status: "ok",
    posts
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
