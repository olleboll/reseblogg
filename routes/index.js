'use strict';

const express = require('express');
const router = express.Router();
const uuid = require('uuid/v4')
const moment = require('moment')
const fetch = require('node-fetch')

const { sendMessage, sendError } = require('../util/messenger')

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
  console.log(message)
  try {
    if (message.text) {
      console.log("message had text")
      const command = message.text.split(':')
      if (command.length <= 1) {
        await sendMessage(id, {title: 'Fel', body: 'Inget kommando'})
        return
      }
      const from = await fetchName(id)
      console.log(command)
      console.log(from)
      const { post, err } = await createPost({from: from.first_name, title: command[0], body: command[1]})
      if (err) {
        console.log("there was an error")
        console.error(err)
        await sendMessage(id, {title: 'Fel', body: err})
      } else {
        console.log("created new post.")
        console.log(post)
        memory.id = post.id
        await sendMessage(id, post)
      }
    } else if (message.attachements) {
      console.log("adding image to last post")
      const { url } = message.attachements[0].payload
      console.log(url)
      await addImage(url)
    }
  } catch (err) {
    console.error(err)
    sendError(id, err)
  }
  
})

const fetchName = async (id) => {
  let fetchNameUrl = process.env.GET_USER_NAME_URL.replace("<USERID>", id)
  return fetch(fetchNameUrl + process.env.PAGE_TOKEN).then(res => {
    return res.json()
  }).then( name => {
    console.log(name)
    return name
  }).catch(err => {
    console.error(err)
    return {err}
  })
}

const getPosts = async () => {

  const params = {
    TableName: process.env.POST_TABLE,
    ScanIndexForward: false
  }
  return db.scan(params).promise().then( (items) => {
    console.log(items)
    const posts = items.Items.sort((a,b) => {
      return b.timestamp - a.timestamp
    })
    return { posts, err: null }
  }).catch(err => {
    console.error(err)
    return { posts: null, err}
  })

}

const addImage = async (url) => {
  const id = memory.id
  if (!id) {return {err: 'no post in memory'}}
  const params = {
    TableName: process.env.POST_TABLE,
    KeyConditionExpression: 'id = :id',
    ExpressionAttributeValues: {
      ':id': id,
    }
  }
  console.log("getting last post")
  console.log(params)
  return db.query(params).promise().then( (data) => {
    console.log(data)
    const lastPost = data.Items[0]
    console.log("lastPost")
    console.log(lastPost)
    lastPost.images.push(url)
    const item = {
      TableName: process.env.POST_TABLE,
      Item: lastPost
    }
    
    return db.put(item).promise().then( (data) => {
      console.log(data)
      return { post: data, err:null}
    }).catch(err => {
      console.error(err)
      return { post: null, err}
    }).catch(err => {
      console.error(err)
      return { posts: null, err}
    })
  })
}

const createPost = async (post) => {
  const newPost = { ...post, images: [], timestamp: new Date().getTime(), id: uuid() }
  const item = {
    TableName: process.env.POST_TABLE,
    Item: newPost
  }
  return db.put(item).promise().then( (data) => {
    return { post: newPost, err: null}
  }).catch(err => {
    console.error(err)
    return { post: null, err}
  })
}

module.exports = router;
