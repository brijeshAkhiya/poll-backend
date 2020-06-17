const mongoose = require('mongoose')
const { db: { url } } = require('./Config/config')
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, result) => {
  if (err) {
    console.log(err)
  } else {
    console.log('Connected')
  }
})
