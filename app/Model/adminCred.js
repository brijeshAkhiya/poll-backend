const mongoose = require('mongoose')

const admincred = new mongoose.Schema({
  sUname: {
    type: String,
    required: true
  },
  sPass: {
    type: String,
    required: true
  },
  token: {
    type: String
  }
})
const adminCred = mongoose.model('adminCred', admincred)
module.exports = adminCred
