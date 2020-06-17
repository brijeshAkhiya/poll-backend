const router = require('express').Router()
const auth = require('./Auth')
const pollManagement = require('./Poll Management')

router.use('/', auth)
router.use('/', pollManagement)

module.exports = router
