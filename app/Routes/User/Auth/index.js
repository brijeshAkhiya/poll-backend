const router = require('express').Router()
const controller = require('./Libs/Controllers/controllers')
const validators = require('./Libs/Validators/validators')

router.post('/userSignup', validators.login, controller.userSignup)
router.post('/userLogin', validators.login, controller.userLogin)

module.exports = router
