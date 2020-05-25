const mongoose = require('mongoose')
const polldata = new mongoose.Schema({
  publisherId: {
    type: String,
    required: true
  },
  backgroundPicture: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: {
    required: true,
    type: [Object],
  }
})
const pollData = mongoose.model('pollData', polldata)
module.exports = pollData
