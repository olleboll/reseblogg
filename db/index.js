const AWS = require('aws-sdk');

AWS.config.update({
  endpoint: new AWS.Endpoint(process.env.AWS_DYNAMO_URL),
  region: 'eu-west-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
})
const dynamo = new AWS.DynamoDB();
const client = new AWS.DynamoDB.DocumentClient();


module.exports = client
