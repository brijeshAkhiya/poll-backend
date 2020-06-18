const mongoose = require('mongoose')
require('../../env')
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (err, result) => {
  if (err) {
    console.log(err)
  } else {
    console.log('Connected')
  }
})
