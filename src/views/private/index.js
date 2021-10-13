const express = require('express')
const router = express.Router()


router.use((req, res, next) => {
    if (process.env.API_KEY) {
        if (req.query.key != process.env.API_KEY) {
            res.redirect('/')
        }
        else {
            next()
        }
    }
    else {
        next()
    }
})


router.use('/facebook',require('./facebook'))
router.use('/drive',require('./drive'))
router.use('/stat',require('./stat'))
router.use('/queue',require('./queue'))

module.exports = router