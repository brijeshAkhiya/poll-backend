const app = {}

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const adminRoute = require('./Admin')

app.use(express.urlencoded())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/', adminRoute)

module.exports = app
