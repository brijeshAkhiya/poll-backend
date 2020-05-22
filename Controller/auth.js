const router = require('express').Router()
const adminCred = require('../Model/adminCred')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
router.post('/signup', (req, res) => {
  const sUname = req.body.sUname
  const sPass = req.body.sPass
  const salt = bcrypt.genSaltSync(10)
  const pass = bcrypt.hashSync(sPass, salt)
  const tempObj = { sUname: sUname, sPass: pass }
  adminCred.insertMany(tempObj, (err, result) => {
    if (err) {
      res.send(err)
    } else {
      res.send(result)
    }
  })
})
router.post('/login', (req, res) => {
  const sUname = req.body.sUname
  const sPass = req.body.sPass
  adminCred.findOne({ sUname: sUname }, (err, result) => {
    if (err) {
      res.json({ err })
    }
    if (result == null) {
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
  }
  )
})
module.exports = router
