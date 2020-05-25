const mongoose = require('mongoose')
const userdata = new mongoose.Schema({
  sUname: {
    type: String,
    required: true
  },
  sEmail: {
    type: String,
    required: true
  },
  sPass: {
    type: String,
    required: true
  }
})
const userData = mongoose.model('userData', userdata)
module.exports = userData
