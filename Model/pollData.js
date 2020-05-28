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
  options: {
    required: true,
    type: [Object]
  },
  answerStates: {
    type: [Object],
    required: true
  },
  totalSubmission: {
    type: Number,
    required: true
  },
  expiryData: {
    type: Date
  }
})
const pollData = mongoose.model('pollData', polldata)
module.exports = pollData
