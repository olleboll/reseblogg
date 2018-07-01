'use strict';

const express = require('express');
const router = express.Router();
const uuid = require('uuid/v4')
const moment = require('moment')


const db = require('../db')


router.get('/posts', async (req, res, next) => {
  console.log("yo")
  const {posts, err} = await getPosts()
  return res.json({
    status: "ok",
    posts
  })
})

router.post('/posts', async (req, res, next) => {

  console.log("posting a post")
  console.log(req.body)
  const { post, err } = await createPost(req.body)
  if (err) {
    return res.json({
      status: "not ok",
      err
    })
  }
  return res.json({
    status: "ok",
    post
  })
})

const getPosts = async () => {

  const params = {
    TableName: process.env.POST_TABLE
  }
  return db.scan(params).promise().then( (items) => {
    const posts = items.Items
    return { posts, err: null }
  }).catch(err => {
    return { posts: null, err}
  })

}

const createPost = async (post) => {
  const item = {
    TableName: process.env.POST_TABLE,
    Item: {
      id: uuid(),
      date: moment().format(),
      title: post.title,
      body: post.body,
      location: post.location,
    }
  }
  return db.put(item).promise().then( (data) => {
    console.log(data)
    return { post: data, err:null}
  }).catch(err => {
    console.error(err)
    return { post: null, err}
  })
}

module.exports = router;
