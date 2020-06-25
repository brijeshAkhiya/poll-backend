const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
// app.use(express.urlencoded())
app.use(cors())
const route = require('./app/Routes')
// eslint-disable-next-line no-path-concat
app.use(express.static('./public'))
app.use(express.static('./public/Images'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/', route)

app.get('/', (req, res) => {
  // eslint-disable-next-line no-path-concat
  res.sendFile(__dirname + '/index.html')
})
app.listen(process.env.PORT || process.env.NODE_ENV, () => {
  console.log('Listening on port ' + process.env.NODE_ENV)
})
