// All the requires for backend
const bcrypt = require('bcrypt')
const adminCred = require('../Model/adminCred')
const jwt = require('jsonwebtoken')
const pollData = require('../Model/pollData')
const ObjectId = require('mongodb').ObjectId
const userPollStates = require('../Model/userPollStates')
const adminControllers = {}
adminControllers.adminSignup = (req, res) => {
  const salt = bcrypt.genSaltSync(10)
  const tempObj = { sUname: req.body.sUname, sPass: bcrypt.hashSync(req.body.sPass, salt) }
  adminCred.insertMany(tempObj, (err, result) => {
    if (err) {
      res.send(err)
    } else {
      res.send(result)
    }
  })
}

adminControllers.adminLogin = (req, res) => {
  adminCred.findOne({ sUname: req.body.sUname }, (err, result) => {
    if (err) {
      res.json({ err })
    }
    if (result == null) {
      res.json({ message: 'Username doesn\'t exist' })
    } else {
      const x = bcrypt.compareSync(req.body.sPass, result.sPass)
      if (x) {
        const token = jwt.sign({ id: result._id }, 'secretKey')
        res.json({ token })
      } else {
        res.json({ message: 'Password Incorrect' })
      }
    }
  })
}

adminControllers.getAdminPollData = (req, res) => {
  let date = new Date()
  date = date.toISOString().slice(0, 10)
  pollData.deleteMany({ expiryDate: date }, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      console.log(result)
    }
  })
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
    $lookup: {
      from: 'admincreds',
      pipeline: [
        { $match: { _id: ObjectId(req.token.id) } }
      ],
      as: 'creds'
    }
  },
  {
    $unwind: {
      path: '$creds'
    }
  }, {
    $addFields: {
      sUname: '$creds.sUname'
    }
  }, {
    $project: {
      creds: 0
    }
  }
  ]
  pollData.aggregate(query, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send(result)
    }
  })
}

adminControllers.publishPoll = (req, res) => {
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
}

adminControllers.deletePoll = (req, res) => {
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
}

module.exports = adminControllers
