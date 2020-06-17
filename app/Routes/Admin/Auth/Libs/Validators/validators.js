const validators = {}

validators.login = (req, res, next) => {
  if (!req.body.sPassword && !req.body.sEmail) res.send({ messages: 'Field Required' })
  next()
}

module.exports = validators
