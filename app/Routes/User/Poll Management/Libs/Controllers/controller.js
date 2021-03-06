const userCred = require('../../../../../Model/userData')
const pollData = require('../../../../../Model/pollData')
const userPollStates = require('../../../../../Model/userPollStates')
const controller = {}

controller.getUserData = (req, res) => {
  try {
    const token = req.token.id
    userCred.find({ _id: token })
      .then(result => {
        res.send(result)
      })
      .catch(err => {
        console.log(err)
      })
  } catch (error) {
    return {}
  }
}

controller.submitPollStates = (req, res) => {
  try {
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
            res.send({ data: result })
          }
        })
      }
    })
  } catch (error) {
    return {}
  }
}

controller.userSubmission = (req, res, next) => {
  try {
    const token = req.token.id
    const tempObj = {
      userId: token,
      pollsSubmitted: req.body.pollId
    }
    userPollStates.findOne({ userId: token }, (err, result) => {
      if (err) {
        res.send({ data: result })
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
  } catch (error) {
    return {}
  }
}

controller.userPollData = (req, res) => {
  try {
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
              res.send({ data: demoArr1 })
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
                res.send({ data: demoArr1 })
              }
            }
          }
        })
      }
    })
  } catch (error) {
    return {}
  }
}

module.exports = controller
