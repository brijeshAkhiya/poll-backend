const bcrypt = require('bcrypt')
const userCred = require('../../../../Model/userData')
const jwt = require('jsonwebtoken')
const pollData = require('../../../../Model/pollData')
const userPollStates = require('../../../../Model/userPollStates')
const userContoller = {}
userContoller.userSignup = (req, res) => {
  userCred.findOne({ $or: [{ sUname: req.body.sUname }, { sEmail: req.body.sEmail }] }, (err, result) => {
    if (err) {
      res.json({ err })
    }
    if (result == null) {
      const salt = bcrypt.genSaltSync(10)
      const pass = bcrypt.hashSync(req.body.sPass, salt)
      const tempObj = {
        sUname: req.body.sUname,
        sEmail: req.body.sEmail,
        sPass: pass
      }
      userCred.insertMany(tempObj)
      res.json({ message: 'User registered' })
    } else {
      res.json({ eMessage: 'Username or Email already exists' })
    }
  })
}

userContoller.userLogin = (req, res) => {
  userCred.findOne({ $or: [{ sUname: req.body.sUname }, { sEmail: req.body.sUname }] }, (err, result) => {
    if (err) {
      res.json({ err })
    }
    if (result === null) {
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

userContoller.getUserData = (req, res) => {
  const token = req.token.id
  userCred.find({ _id: token })
    .then(result => {
      res.send(result)
    })
    .catch(err => {
      console.log(err)
    })
}

userContoller.submitPollStates = (req, res) => {
  let tempArr = []
  pollData.findOne({ _id: req.body.pollId }, (err, result) => {
    if (err) {
      res.send(err)
    } else {
      result.answerStates.forEach(values => {
        if (req.body.selectedOption === values.option) {
          values.submission++
          result.totalSubmission++
        }
      })
      result.answerStates.forEach(values => { values.percentage = (values.submission / result.totalSubmission) * 100 })
      result.answerStates.forEach(values => {
        values.percentage = values.percentage.toFixed(2)
      })
      tempArr = result.answerStates
      pollData.updateOne({ _id: req.body.pollId }, { answerStates: tempArr, totalSubmission: result.totalSubmission }, (err, result1) => {
        if (err) {
          res.send(err)
        } else {
          res.send(result)
        }
      })
    }
  })
}

userContoller.userSubmission = (req, res, next) => {
  const token = req.token.id
  // const pollId = req.body.pollId
  const tempObj = {
    userId: token,
    pollsSubmitted: req.body.pollId
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
            // res.send(result1)
          }
        })
      } else {
        let tempArr = []
        tempArr = result.pollsSubmitted
        tempArr.push(req.body.pollId)
        userPollStates.updateOne({ userId: token }, { pollsSubmitted: tempArr }, (err, result2) => {
          if (err) {
            // res.send(err)
          } else {
            // res.send(result2)
          }
        })
      }
    }
  })
}

userContoller.userPollData = (req, res) => {
  const demoArr = []
  const demoArr1 = []
  const token = req.token.id
  let date = new Date()
  date = date.toISOString().slice(0, 10)
  pollData.deleteMany({ expiryDate: date }, (err, result) => {
    if (err) {
      console.log(err)
    } else {
    }
  })
  pollData.find({}, (err, result) => {
    if (err) {
      res.send(err)
    } else {
      userPollStates.find({ userId: token }, (err, result1) => {
        if (err) {
          res.send(err)
        } else {
          if (result1.length === 0) {
            demoArr1.push(result[0])
            res.send(demoArr1)
          } else {
            result.forEach(element => {
              if (result1[0].pollsSubmitted.includes(element._id)) {
              } else {
                demoArr.push(element)
              }
            })
            if (demoArr.length === 0) {
              res.send({ message: 'You\'ve answered all the polls' })
            } else {
              demoArr1.push(demoArr[0])
              res.send(demoArr1)
            }
          }
        }
      })
    }
  })
}

module.exports = userContoller
