const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const controller = {}
const userCred = require('../../../../../Model/userData')
require('../../../../../../env')

controller.userSignup = (req, res) => {
  try {
    userCred.findOne({ $or: [{ sUname: req.body.sUname }, { sEmail: req.body.sEmail }] }, (err, result) => {
      if (err) {
        res.json({ err })
      }
      if (result == null) {
        const salt = bcrypt.genSaltSync(process.env.SALT_NUMBER)
        const pass = bcrypt.hashSync(req.body.sPass, salt)
        const tempObj = {
          sUname: req.body.sUname,
          sEmail: req.body.sEmail,
          sPass: pass
        }
        userCred.insertMany(tempObj)
        res.json({ message: 'User registered' })
      } else {
        res.json({ eMessage: 'Username or Email already exists' })
      }
    })
  } catch (error) {
    return {}
  }
}

controller.userLogin = (req, res) => {
  try {
    userCred.findOne({ $or: [{ sUname: req.body.sUname }, { sEmail: req.body.sUname }] }, (err, result) => {
      if (err) {
        res.json({ err })
      }
      if (result === null) {
        res.json({ message: 'Username doesn\'t exist' })
      } else {
        const x = bcrypt.compareSync(req.body.sPass, result.sPass)
        if (x) {
          const token = jwt.sign({ id: result._id }, process.env.JWT_KEY)
          res.json({ token })
        } else {
          res.json({ message: 'Password Incorrect' })
        }
      }
    })
  } catch (error) {
    return {}
  }
}

module.exports = controller
