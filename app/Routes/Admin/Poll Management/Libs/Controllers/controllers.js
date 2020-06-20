const pollData = require('../../../../../Model/pollData')
const adminCred = require('../../../../../Model/adminCred')
const userPollStates = require('../../../../../Model/userPollStates')
const controllers = {}

controllers.getAdminPollData = (req, res) => {
  let date = new Date()
  date = date.toISOString().slice(0, 10)
  try {
    pollData.deleteMany({ expiryDate: date })
    const query = [{
      $match: {
        publisherId: req.token.id
      }
    },
    {
      $unwind: {
        path: '$answerStates'
      }
    },
    {
      $sort: {
        'answerStates.submission': -1
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
    },
    {
      $sort: {
        totalSubmission: -1
      }
    }
    ]
    pollData.aggregate(query, (err, result) => {
      if (err) {
        res.send({ error: 'Something went wrong!' })
      } else {
        if (result.length === 0) {
          adminCred.find({ _id: req.token.id }, (err, result) => {
            if (err) {
              res.send({ error: 'Something went wrong!' })
            } else {
              res.send({ data: result })
            }
          })
        } else {
          res.send({ data: result })
        }
      }
    })
  } catch (error) {
    return error
  }
}

controllers.publishPoll = (req, res) => {
  try {
    const backgroundImgPath = req.body.backgroundImgPath
    const question = req.body.question
    const option = req.body.options
    const expiryDate = req.body.expiryDate
    const answerStates = []
    const totalSubmission = 0
    // This is for formatting according to schema
    for (const values in option) {
      const tempObj1 = { option: option[values], submission: 0, percentage: 0 }
      answerStates.push(tempObj1)
    }
    const tempObj = {
      publisherId: req.token.id,
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
  } catch (error) {
    return {}
  }
}

controllers.deletePoll = (req, res) => {
  try {
    const pollId = req.body.pollId
    pollData.deleteOne({ _id: pollId }, (err) => {
      if (err) {
        console.log(err)
      } else {
        res.send({ message: 'Poll Deleted' })
      }
    })
    userPollStates.updateMany({ pollsSubmitted: { $all: [pollId] } }, { $pull: { pollsSubmitted: pollId } }, (err) => {
      if (err) {
        console.log(err)
      } else {
        // console.log(result)
      }
    })
  } catch (error) {
    return {}
  }
}

module.exports = controllers
