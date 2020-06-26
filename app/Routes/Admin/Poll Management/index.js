const router = require('express').Router()
const middleware = require('./Libs/Middlewares/middleware')
const controller = require('./Libs/Controllers/controllers')
const multer = require('multer')
const storage = require('../../../utils').services.storage
const upload = multer({ storage })
router.get('/getAdminPollData', middleware.verifyToken, controller.getAdminPollData)
router.post('/publishPoll', middleware.verifyToken, upload.single('file'), controller.publishPoll)
router.post('/deletePoll', controller.deletePoll)
router.post('/editPoll',middleware.verifyToken, upload.single('file'), controller.editPoll)
module.exports = router
