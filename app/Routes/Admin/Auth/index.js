/* eslint-disable no-new-require */
// eslint-disable-next-line new-cap
const router = require('express').Router()
const controller = require('./Libs/Controllers/controllers')
const validators = require('./Libs/Validators/validators')

router.post('/adminSignup', validators.login, controller.adminSignup)
router.post('/adminLogin', validators.login, controller.adminLogin)

module.exports = router
