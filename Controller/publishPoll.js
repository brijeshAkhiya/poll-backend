const router = require('express').Router()
const verifyToken = require('../Middleware/verifyToken')
const pollData = require('../Model/pollData')
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
  // pollData.find({ publisherId: token }, (err, result) => {
  //   if (err) {
  //     res.send(err)
  //   } else {
  //     console.log(result)
  //     res.send(result)
  //   }
  // })
  pollData.aggregate([{
    $match: {
      publisherId: token
    }
  }, {
    $unwind: {
      path: '$answerStates'
    }
  }, {
    $sort: {
      'answerStates.percentage': -1
    }
  }, {
    $group: {
      _id: '$_id',
      options: { $addToSet: '$options' },
      answerStates: { $push: '$answerStates' },
      publisherId: { $addToSet: '$publisherId' },
      backgroundImgPath: { $addToSet: '$backgroundImgPath' },
      question: { $addToSet: '$question' },
      totalSubmission: { $addToSet: '$totalSubmission' }
    }
  }, {
    $unwind: {
      path: '$options'
    }
  }, {
    $unwind: {
      path: '$publisherId'
    }
  }, {
    $unwind: {
      path: '$backgroundImgPath'
    }
  }, {
    $unwind: {
      path: '$question'
    }
  }, {
    $unwind: {
      path: '$totalSubmission'
    }
  }], (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send(result)
    }
  })
})
module.exports = router
