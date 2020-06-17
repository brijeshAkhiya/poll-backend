const validators = {}

validators.login = (req, res, next) => {
  if (!req.body.sPass && !req.body.sUname) res.send({ messages: 'Field Required' })
  next()
}

module.exports = validators
