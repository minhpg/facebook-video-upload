const express = require('express')
const router = express.Router()

router.get('/iframe/:id',require('./iframe'))
router.post('/json/:id',require('./json'))
router.get('/dash/:group_id/:video_id/manifest.mpd',require('./dash'))

module.exports = router