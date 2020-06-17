const router = require('express').Router()
const userController = require('./Libs/Controllers/contoller')
const verifyToken = require('./Libs/Middleware/middleware')
router.post('/userSignup', userController.userSignup)
router.post('/userLogin', userController.userLogin)
router.get('/getUserData', verifyToken, userController.getUserData)
router.post('/submitPollStates', userController.submitPollStates)
router.post('/userSubmission', verifyToken, userController.userSubmission)
router.get('/userPollData', verifyToken, userController.userPollData)

module.exports = router
