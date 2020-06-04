const router = require('express').Router()
const userCred = require('../Model/userData')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const verifyToken = require('../Middleware/verifyToken')
router.post('/userSignup', (req, res) => {
  const sUname = req.body.sUname
  const sEmail = req.body.sEmail
  const sPass = req.body.sPass

  userCred.findOne({ $or: [{ sUname: sUname }, { sEmail: sEmail }] }, (err, result) => {
    if (err) {
      res.json({ err })
    }
    if (result == null) {
      const salt = bcrypt.genSaltSync(10)
      const pass = bcrypt.hashSync(sPass, salt)
      const tempObj = {
        sUname: sUname,
        sEmail: sEmail,
        sPass: pass
      }
      userCred.insertMany(tempObj)
      res.json({ message: 'User registered' })
    } else {
      res.json({ message: 'Username or Email already exists' })
    }
  })
})

router.post('/userLogin', (req, res) => {
  const sUname = req.body.sUname
  const sPass = req.body.sPass
  userCred.findOne({ $or: [{ sUname: sUname }, { sEmail: sUname }] }, (err, result) => {
    if (err) {
      res.json({ err })
    }
    if (result === null) {
      res.json({ message: 'Username doesn\'t exist' })
    } else {
      const x = bcrypt.compareSync(sPass, result.sPass)
      if (x) {
        const token = jwt.sign({ id: result._id }, 'secretKey')
        res.json({ token })
      } else {
        res.json({ message: 'Password Incorrect' })
      }
    }
  })
})
router.get('/getUserData', verifyToken, (req, res) => {
  const token = req.token.id
  userCred.find({ _id: token })
    .then(result => {
      res.send(result)
    })
    .catch(err => {
      console.log(err)
    })
})
module.exports = router
