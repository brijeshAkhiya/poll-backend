const router = require('express').Router()
const verifyToken = require('../Config/config')
const pollData = require('../Model/pollData')
router.post('/publishPoll', (req, res) => {
  const publisherId = req.body.publisherId
  const backgroundPicture = req.body.imgPath
  const question = req.body.question
  const options = req.body.options
  const tempObj = {}
})
