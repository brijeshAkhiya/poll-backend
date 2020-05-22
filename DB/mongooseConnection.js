const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://brijesh_1116:mLab17@mycluster0-xnamd.mongodb.net/pollManagement?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }, (err, result) => {
  if (err) {
    console.log(err)
  } else {
    console.log('Connected')
  }
})
