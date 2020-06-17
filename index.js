/* eslint-disable no-path-concat */
require('./app/DB/mongooseConnection')
const express = require('express')
const cors = require('cors')
const app = express()
const { app: { serverPort } } = require('./Config/config')
const adminService = require('./app/Routes/Admin/index')
const userService = require('./app/Routes/User/index')

const bodyParser = require('body-parser')
app.use(express.urlencoded())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/', adminService)
app.use('/', userService)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})
app.listen(process.env.PORT || serverPort, () => {
  console.log('Listening on port ' + serverPort)
})
