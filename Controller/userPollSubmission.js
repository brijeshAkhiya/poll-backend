const router = require('express').Router()
const pollData = require('../Model/pollData')
const verifyToken = require('../Middleware/verifyToken')
const userPollStates = require('../Model/userPollStates')
router.post('/submitPollStates', (req, res) => {
  const pollId = req.body.pollId
  const selectedOption = req.body.selectedOption
  let tempArr = []
  pollData.findOne({ _id: pollId }, (err, result) => {
    if (err) {
      res.send(err)
    } else {
      result.answerStates.forEach(values => {
        if (selectedOption === values.option) {
          values.submission++
          result.totalSubmission++
        }
      })
      result.answerStates.forEach(values => { values.percentage = (values.submission / result.totalSubmission) * 100 })
      result.answerStates.forEach(values => {
        values.percentage = values.percentage.toFixed(2)
      })
      tempArr = result.answerStates
      pollData.updateOne({ _id: pollId }, { answerStates: tempArr, totalSubmission: result.totalSubmission }, (err, result1) => {
        if (err) {
          res.send(err)
        } else {
          res.send(result)
        }
      })
    }
  })
})
router.post('/userSubmission', verifyToken, (req, res) => {
  const token = req.token.id
  const pollId = req.body.pollId
  const tempObj = {
    userId: token,
    pollsSubmitted: pollId
  }
  userPollStates.findOne({ userId: token }, (err, result) => {
    if (err) {
      res.send(result)
    } else {
      if (result === null) {
        userPollStates.insertMany(tempObj, (err, result1) => {
          if (err) {
            console.log(err)
          } else {
            res.send(result1)
          }
        })
      } else {
        let tempArr = []
        tempArr = result.pollsSubmitted
        tempArr.push(pollId)
        userPollStates.updateOne({ userId: token }, { pollsSubmitted: tempArr }, (err, result2) => {
          if (err) {
            res.send(err)
          } else {
            res.send(result2)
          }
        })
      }
    }
  })
})
router.get('/userPollData', verifyToken, (req, res) => {
  const demoArr = []
  const token = req.token.id
  pollData.find({}, (err, result) => {
    if (err) {
      res.send(err)
    } else {
      userPollStates.find({ userId: token }, (err, result1) => {
        if (err) {
          res.send(err)
        } else {
          result.forEach(element => {
            if (result1[0].pollsSubmitted.includes(element._id)) {
            } else {
              demoArr.push(element)
            }
          })
          res.send(demoArr[0])
        }
      })
    }
  })
})
module.exports = router
