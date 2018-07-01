'use strict'

require('dotenv').config();

const express = require('express')
const app = express()
const bodyParser = require('body-parser')


const routes = require('./routes')

app.use(express.static(__dirname+'/public'))
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());



app.use('/api/',routes)

const port = process.env.PORT || 3001
app.listen(port, function () {
  console.log(`sara och olle listening on port ${port}!`)
})
