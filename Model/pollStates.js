const mongoose = require('mongoose')
const pollstates = new mongoose.Schema({
  pollId: {
    type: String,
    required: true
  },
  answerStates: {
    type: Object,
    required: true
  }
})
const pollStates = mongoose.model('pollStates', pollstates)
module.exports = pollStates
