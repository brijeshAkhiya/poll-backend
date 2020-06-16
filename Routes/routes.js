const router = require('express').Router()
const adminController = require('../Controller/adminController')
const userController = require('../Controller/userContoller')
const verifyToken = require('../Middleware/verifyToken')

// Admin Controllers
router.post('/signup', adminController.adminSignup)
router.post('/adminLogin', adminController.adminLogin)
router.get('/getAdminPollData', verifyToken, adminController.getAdminPollData)
router.post('/publishPoll', verifyToken, adminController.publishPoll)
router.post('/deletePoll', adminController.deletePoll)

// User Controllers
router.post('/userSignup', userController.userSignup)
router.post('/userLogin', userController.userLogin)
router.get('/getUserData', verifyToken, userController.getUserData)
router.post('/submitPollStates', userController.submitPollStates)
router.post('/userSubmission', verifyToken, userController.userSubmission)
router.get('/userPollData', verifyToken, userController.userPollData)

module.exports = router
