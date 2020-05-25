const router = require('express').Router()
const userData = require('../Model/userData')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
router.post('/userSignup', (req, res) => {
  const sUname = req.body.sUname
  const sEmail = req.body.sEmail
  const sPass = req.body.sPass
  userData.findOne({ $or: [{ sUname: sUname }, { sEmail: sEmail }] }, (err, result) => {
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
      userData.insertMany(tempObj)
      res.json({ message: 'User registered' })
    } else {
      res.json({ message: 'Username or Email already exists, please login!' })
    }
  })
})

router.post('/userLogin', (req, res) => {
  const sUname = req.body.sUname
  const sPass = req.body.sPass
  userData.findOne({ $or: [{ sUname: sUname }, { sEmail: sUname }] }, (err, result) => {
    if (err) {
      res.json({ err })
    }
    if (result === null) {
      res.json({ message: 'No User Exists' })
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
module.exports = router
