const { StoryAPI } = require('../../private/facebook/get')
const { getCookie } = require('../../../utils')
const videoSchema = require('../../../models/video')
const cache = require('../../../cache')
const AES = require('./aes')

module.exports = async (req, res) => {
    try {
        const id = req.params.id
        const KEY = `CACHE:V1:JSON:${id}`
        const is_cache = await cache.get(KEY)
        let json_data
        if (is_cache) {
            json_data = JSON.parse(is_cache)
        }
        else {
            if (!id.match(/^[0-9a-fA-F]{24}$/)) {
                throw new Error('Video does not exist!')
            }
            const video = await videoSchema.findOne({ _id: id }).exec()
            if (video) {
                const { video_id, group_id } = video
                const cookie = await getCookie(group_id)
                const streams = await StoryAPI(video_id, group_id, cookie.data)
                if (streams) {
                    data = AES.enc(JSON.stringify({
                        title: video.title,
                        mp4: streams,
                        dash: `${process.env.HOST}/public/dash/${group_id}/${video_id}/manifest.mpd`
                    }), id)
                    json_data = {
                        status: true,
                        data: data
                    }
                    await cache.setex(KEY, 2 * 60 * 60, JSON.stringify(json_data))
                }
                else {
                    throw new Error('No quality avaiable!')
                }
            }
            else {
                throw new Error('Video does not exist!')
            }
        }
        res.setHeader('access-control-allow-origin',process.env.CORS_DOMAIN || '*')
        res.json(json_data)
    }
    catch (err) {
        res.json({
            status: false,
            message: err.message
        })
    }
}