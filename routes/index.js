'use strict';

const express = require('express');
const router = express.Router();
const uuid = require('uuid/v4')
const moment = require('moment')

const { sendMessage } = require('../util/messenger')

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

const memory = {}

router.post('/bot', async (req, res, next) => {
  console.log("meddelande från bot")
  res.status(200).send("OK")
  const fullMessage = req.body.entry[0].messaging[0]
  const { message } = fullMessage
  const { id } = fullMessage.sender
  if (message.text) {
    const command = message.text.split(':')
    if (command.length <= 1) {
      await sendMessage(id, {title: 'Fel', body: 'Inget kommando'})
      return
    }
    const from = await fetchName(id)
    const { post, err } = await createPost({from, title: command[0], body: command[1]})
    if (err) {
      await sendMessage(id, {title: 'Fel', body: err})
    } else {
      await sendMessage(id, post)
    }
  } else if (message.attachments) {
    const { url } = message.attachments[0].payload
    await addImage(url)
  }
  
})

const fetchName = async (id) => {
  let fetchNameUrl = process.env.GET_USER_NAME_URL.replace("<USERID>", id)
  return fetch(fetchNameUrl + process.env.PAGE_TOKEN).then(res => {
    return res.json()
  }).then( name => {
    console.log(name)
    return name
  })
}

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

const addImage = async (url) => {
  const params = {
    TableName: process.env.POST_TABLE,
    limit: 1
  }
  return db.scan(params).promise().then( (items) => {
    const lastPost = items.Items[0]
    if (!lastPost.images) { lastPost.images = [] }
    lastPost.images.push(url)
    const item = {
      TableName: process.env.POST_TABLE,
      Item: lastPost
    }
    return db.put(lastPost).promise().then( (data) => {
      console.log(data)
      return { post: data, err:null}
    }).catch(err => {
      console.error(err)
      return { post: null, err}
    }).catch(err => {
      return { posts: null, err}
    })
  })
}

const createPost = async (post) => {
  const item = {
    TableName: process.env.POST_TABLE,
    Item: {
      id: uuid(),
      timestamp: new Date().getTime(),
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
