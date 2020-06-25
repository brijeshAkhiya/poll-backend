const jwt = require('jsonwebtoken')
const middleware = {}
middleware.verifyToken = (req, res, next) => {
  // eslint-disable-next-line dot-notation
  const token = req.header('Authorization')
  jwt.verify(token, 'secretKey', (err, result) => {
    if (err) {
      console.log(err)
    } else {
      req.token = result
      next()
    }
  })
}

module.exports = middleware
