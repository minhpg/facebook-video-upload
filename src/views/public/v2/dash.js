const { DashAPI } = require('../../private/facebook/get')
const { getCookie } = require('../../../utils')
const cache = require('../../../cache')


module.exports = async (req, res) => {
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
        res.setHeader('access-control-allow-origin',process.env.CORS_DOMAIN || '*')
        res.send(dash_data)
    }
    catch (err) {
        res.json({
            status: false,
            message: err.message
        })
    }
}