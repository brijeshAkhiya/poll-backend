const router = require('express').Router()
const adminRoute = require('./Admin')
const userRoute = require('./User')

router.use('/', adminRoute)
router.use('/', userRoute)

module.exports = router
