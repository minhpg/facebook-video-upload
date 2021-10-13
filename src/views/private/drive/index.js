const express = require('express')
const router = express.Router()

router.get('/delete/:id', require('./delete'))
router.get('/retry/:id', require('./retry'))
router.get('/retry', require('./retryAll'))
router.get('/add/:id', require('./add'))
router.get('/get/:id', require('./get'))

module.exports = router