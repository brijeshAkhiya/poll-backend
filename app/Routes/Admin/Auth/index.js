/* eslint-disable no-new-require */
// eslint-disable-next-line new-cap
const router = require('express').Router()
const controller = require('./Libs/Controllers/controllers')
const validators = require('./Libs/Validators/validators')
const middleware = require('./Libs/Middleware/middleware')

router.post('/adminSignup', validators.login, controller.adminSignup)
router.post('/adminLogin', validators.login, controller.adminLogin)
router.get('/getAdminData', middleware.verifyToken, controller.getAdminData)

module.exports = router
