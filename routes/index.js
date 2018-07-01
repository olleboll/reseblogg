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

router.get('/bot', (req, res, next) => {
  let response = {}
  const { query } = req ;
  const token = query['hub.verify_token']
  if (token === process.env.VERIFY_TOKEN) {
    var challenge = query['hub.challenge']
    res.status(200).send(challenge)
  } else {
    response = {
      'body': 'Error, wrong validation token',
      'statusCode': 422
    };

    res.status(200).json(response)
  }
})

router.post('/bot', (req, res, next) => {
  console.log(req.body)
  const message = req.body.entry[0].messaging[0]
  console.log(message)
  //sendMessage(req.body.)
  res.status(200).send("OK")
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
