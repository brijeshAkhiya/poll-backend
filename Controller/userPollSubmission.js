const router = require('express').Router()
const pollData = require('../Model/pollData')
router.post('/submitPollStates', (req, res) => {
  const pollId = req.body.pollId
  const selectedOption = req.body.selectedOption
  let tempArr = []
  pollData.findOne({ _id: pollId }, (err, result) => {
    if (err) {
      res.send(err)
    } else {
      for (const values in result.answerStates) {
        if (selectedOption === result.answerStates[values].option) {
          result.answerStates[values].percentage++
          result.totalSubmission++
          tempArr = result.answerStates
          pollData.update({ _id: pollId }, { answerStates: tempArr }, (err, result1) => {
            if (err) {
              res.send(err)
            } else {
              res.send(result)
            }
          })
        }
      }
    }
  })
})
module.exports = router
