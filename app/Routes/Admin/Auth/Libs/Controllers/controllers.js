const bcrypt = require('bcrypt');
const adminCred = require('../../../../../Model/adminCred');
const jwt = require('jsonwebtoken');
require('../../../../../../env');
const controllers = {};
controllers.adminSignup = function(req, res) {
  try {
    const salt = bcrypt.genSaltSync(10);
    const tempObj = { sUname: req.body.sUname, sPass: bcrypt.hashSync(req.body.sPass, salt) };
    adminCred.insertMany(tempObj, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
  } catch (error) {
    return {};
  }
};

controllers.adminLogin = (req, res) => {
  try {
    adminCred.findOne({ sUname: req.body.sUname }, (err, result) => {
      if (err) {
        res.send({ error: 'Something went wrong!' });
      }
      if (result == null) {
        res.json({ message: 'Username doesn\'t exist' });
      } else {
        const x = bcrypt.compareSync(req.body.sPass, result.sPass);
        if (x) {
          const token = jwt.sign({ id: result._id }, process.env.JWT_KEY);
          adminCred.update({ _id: result._id }, { token: token }, { upsert: true });
          res.json({ token });
        } else {
          res.json({ message: 'Password Incorrect' });
        }
      }
    });
    return {};
  } catch (error) {
  }
};

controllers.getAdminData = (req, res) => {
  try {
    adminCred.find({ _id: req.token.id }, (err, result) => {
      if (err) {
        res.send({ error: 'Something went wrong!' });
      } else {
        res.send({ data: result });
      }
    });
  } catch (error) {
    return {};
  }
};
module.exports = controllers;
