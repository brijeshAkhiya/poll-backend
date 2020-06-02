const router = require('express').Router()
const verifyToken = require('../Middleware/verifyToken')
const pollData = require('../Model/pollData')
const userPollStates = require('../Model/userPollStates')
router.post('/publishPoll', verifyToken, (req, res) => {
  const token = req.token.id
  const backgroundImgPath = req.body.backgroundImgPath
  const question = req.body.question
  const option = req.body.options
  const expiryDate = req.body.expiryDate
  const answerStates = []
  const totalSubmission = 0
  for (const values in option) {
    const tempObj1 = { option: option[values], submission: 0, percentage: 0 }
    answerStates.push(tempObj1)
  }
  const tempObj = {
    publisherId: token,
    backgroundImgPath: backgroundImgPath,
    question: question,
    expiryDate: expiryDate,
    answerStates: answerStates,
    totalSubmission: totalSubmission
  }
  pollData.insertMany(tempObj, (err, result) => {
    if (err) {
      console.log(err)
      res.send(err)
    } else {
      console.log(result)
      res.send({ message: 'Poll Published' })
    }
  })
})
router.get('/getAdminPollData', verifyToken, (req, res) => {
  const token = req.token.id
  let date = new Date()
  date = date.toISOString().slice(0, 10)
  pollData.deleteMany({ expiryDate: date }, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      console.log(result)
    }
  })
  pollData.aggregate([{
    $match: {
      publisherId: token
    }
  },
  {
    $unwind: {
      path: '$answerStates'
    }
  },
  {
    $sort: {
      'answerStates.percentage': -1
    }
  },
  {
    $group: {
      _id: '$_id',
      answerStates: { $push: '$answerStates' },
      publisherId: { $addToSet: '$publisherId' },
      backgroundImgPath: { $addToSet: '$backgroundImgPath' },
      question: { $addToSet: '$question' },
      totalSubmission: { $addToSet: '$totalSubmission' }
    }
  },
  {
    $unwind: {
      path: '$publisherId'
    }
  },
  {
    $unwind: {
      path: '$backgroundImgPath'
    }
  },
  {
    $unwind: {
      path: '$question'
    }
  },
  {
    $unwind: {
      path: '$totalSubmission'
    }
  }
  ], (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send(result)
    }
  })
})
router.post('/deletePoll', (req, res) => {
  const pollId = req.body.pollId
  pollData.deleteOne({ _id: pollId }, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send({ message: 'Poll Deleted' })
    }
  })
  userPollStates.updateMany({ pollsSubmitted: { $all: [pollId] } }, { $pull: { pollsSubmitted: pollId } }, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      // console.log(result)
    }
  })
})
module.exports = router
