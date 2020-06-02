const mongoose = require('mongoose')
const polldata = new mongoose.Schema({
  publisherId: {
    type: String,
    required: true
  },
  backgroundImgPath: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  answerStates: {
    type: [Object],
    required: true
  },
  totalSubmission: {
    type: Number,
    required: true
  },
  expiryDate: {
    type: String
  }
})
const pollData = mongoose.model('pollData', polldata)
module.exports = pollData
