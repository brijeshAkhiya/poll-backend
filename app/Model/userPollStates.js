const mongoose = require('mongoose')
const userpollstates = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  pollsSubmitted: {
    type: [String],
    required: true
  }
})
const userPollStates = mongoose.model('userPollStates', userpollstates)
module.exports = userPollStates
