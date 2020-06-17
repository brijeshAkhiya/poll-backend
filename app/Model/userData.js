const mongoose = require('mongoose')
const usercred = new mongoose.Schema({
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
const userCred = mongoose.model('userCred', usercred)
module.exports = userCred
