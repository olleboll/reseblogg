
const fetch = require('node-fetch')

const sendMessage = async (id, post, args) => {
  const text = (args.error)
  ? `Error creating post. ${post.title}`
  : `Created post. Title: ${post.title}, Body: ${post.body}`
  const url = `https://graph.facebook.com/v2.6/me/messages?access_token=${process.env.PAGE_TOKEN}`
  const message = {
    messaging_type: "RESPONSE",
    recipient: { id },
    message: { text }
  }
  
  const response = {
    method: 'POST',
    body: JSON.stringify(message),
    headers: {
      'Content-Type': 'application/json',
    }
  }
  
  return fetch(url, response).then(res => res.json()).then( data => {
    console.log(data)
    return true
  }).catch(err => {
    console.error(err)
    return false
  })
}


module.exports = {
  sendMessage
}
