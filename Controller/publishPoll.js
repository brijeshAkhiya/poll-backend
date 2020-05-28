const router = require('express').Router()
const verifyToken = require('../Middleware/verifyToken')
const pollData = require('../Model/pollData')
// const pollStates = require('../Model/pollStates')
router.post('/publishPoll', verifyToken, (req, res) => {
  const token = req.token.id
  const backgroundImgPath = req.body.backgroundImgPath
  const question = req.body.question
  const option = req.body.options
  const expiryDate = req.body.expiryDate
  const answerStates = []
  const totalSubmission = 0
  for (const values in option) {
    const tempObj1 = { option: option[values], percentage: 0 }
    answerStates.push(tempObj1)
  }
  const tempObj = {
    publisherId: token,
    backgroundImgPath: backgroundImgPath,
    question: question,
    options: option,
    expiryDate: expiryDate,
    answerStates: answerStates,
    totalSubmission: totalSubmission
  }
  pollData.insertMany(tempObj, (err, result) => {
    if (err) {
      console.log(err)
      res.send(err)
    } else {
      res.send(result)
    }
  })
})
router.get('/getAdminPollData', verifyToken, (req, res) => {
  const token = req.token.id
  pollData.find({ publisherId: token }, (err, result) => {
    if (err) {
      res.send(err)
    } else {
      res.send(result)
    }
  })
})
module.exports = router
