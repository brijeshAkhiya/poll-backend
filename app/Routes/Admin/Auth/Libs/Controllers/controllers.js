const bcrypt = require('bcrypt')
const adminCred = require('../../../../Model/adminCred')
const jwt = require('jsonwebtoken')

const controllers = {}
controllers.adminSignup = function (req, res) {
  const salt = bcrypt.genSaltSync(10)
  const tempObj = { sUname: req.body.sUname, sPass: bcrypt.hashSync(req.body.sPass, salt) }
  adminCred.insertMany(tempObj, (err, result) => {
    if (err) {
      res.send(err)
    } else {
      res.send(result)
    }
  })
}

controllers.adminLogin = (req, res) => {
  adminCred.findOne({ sUname: req.body.sUname }, (err, result) => {
    if (err) {
      res.json({ err })
    }
    if (result == null) {
      res.json({ message: 'Username doesn\'t exist' })
    } else {
      const x = bcrypt.compareSync(req.body.sPass, result.sPass)
      if (x) {
        const token = jwt.sign({ id: result._id }, 'secretKey')
        res.json({ token })
      } else {
        res.json({ message: 'Password Incorrect' })
      }
    }
  })
}

module.exports = controllers
