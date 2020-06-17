const router = require('express').Router()
const controller = require('./Libs/Controllers/controller')
const middleware = require('./Libs/Middlewares/middleware')

router.get('/getUserData', middleware.verifyToken, controller.getUserData)
router.post('/submitPollStates', middleware.verifyToken, controller.submitPollStates)
router.post('/userSubmission', middleware.verifyToken, controller.userSubmission)
router.get('/userPollData', middleware.verifyToken, controller.userPollData)

module.exports = router
