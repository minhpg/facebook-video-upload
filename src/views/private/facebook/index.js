const express = require('express')
const { StoryAPI, GraphAPI, DashAPI } = require('./get')
const { getAccount, getCookie } = require('../../../utils')
const cache = require('../../../cache')
const router = express.Router()

router.get('/graph/:group_id/:video_id', async (req, res) => {
    try {
        const { video_id, group_id } = req.params
        const account = await getAccount(group_id)
        stream_url = await GraphAPI(video_id, account.token)
        if (stream_url) {
            res.json({
                status: true,
                data: [{
                    file: stream_url,
                    type: 'video/mp4',
                    label: 'HD'
                }]
            })
        }
        else {
            throw new Error('no quality avaiable')
        }
    }
    catch (err) {
        res.json({
            status: false,
            message: err.message
        })
    }
})

router.get('/dash/:group_id/:video_id/manifest.mpd', async (req, res) => {
    try {
        const { video_id, group_id } = req.params
        KEY = `CACHE:DASH:${video_id}`
        const in_cache = await cache.get(KEY)
        let dash_data
        if(in_cache){
            dash_data = in_cache
        }
        else {
            const cookie = await getCookie(group_id)
            dash_data = await DashAPI(video_id, group_id, cookie.data)
            if(dash_data){
                await cache.setex(KEY,2 * 60 * 60, dash_data)
            }
            else {
                throw new Error('no quality avaiable')
            }
        }
        res.setHeader('content-type','application/dash+xml')
        res.setHeader('access-control-allow-origin','*')
        res.send(dash_data)
    }
    catch (err) {
        res.json({
            status: false,
            message: err.message
        })
    }
})

router.get('/story/:group_id/:video_id', async (req, res) => {
    const { video_id, group_id } = req.params
    try {
        const cookie = await getCookie(group_id)
        const streams = await StoryAPI(video_id, group_id, cookie.data)
        if (streams) {
            res.json({
                status: true,
                data: streams
            })
        }
        else {
            throw new Error('no quality avaiable')
        }
    }
    catch (err) {
        res.json({
            status: false,
            message: err.message
        })
    }
})

module.exports = router