/* eslint-disable no-path-concat */
require('./DB/mongooseConnection')
const express = require('express')
const cors = require('cors')
const app = express()
const { app: { serverPort } } = require('./Config/config')
const adminAuth = require('./Controller/adminAuth')
const userAuth = require('./Controller/userAuth')
const publishPoll = require('./Controller/publishPoll')
const userPollSubmission = require('./Controller/userPollSubmission')
const bodyParser = require('body-parser')
app.use(express.urlencoded())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/', adminAuth)
app.use('/', userAuth)
app.use('/', publishPoll)
app.use('/', userPollSubmission)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})
app.listen(process.env.PORT || serverPort)
