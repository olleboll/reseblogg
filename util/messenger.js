
const sendMessage = (id, text, args) => {
  const url = `https://graph.facebook.com/v2.6/me/messages?access_token=${process.env.PAGE_TOKEN}`
  const message = {
    messaging_type: "RESPONSE",
    recipient: { id },
    message: { text: `EKO: ${text}` }
  }
}


module.exports = {
  sendMessage
}
