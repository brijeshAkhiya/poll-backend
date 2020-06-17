const router = require('express').Router()
const middleware = require('./Libs/Middlewares/middleware')
const controller = require('./Libs/Controllers/controllers')

router.get('/getAdminPollData', middleware.verifyToken, controller.getAdminPollData)
router.post('/publishPoll', middleware.verifyToken, controller.publishPoll)
router.post('/deletePoll', controller.deletePoll)

module.exports = router
