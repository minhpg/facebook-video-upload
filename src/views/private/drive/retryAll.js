const videoSchema = require('../../../models/video')
const { videoQueue } = require('../../../queue')

module.exports = async (req, res) => {

    let priority = 10
    try {
        if (req.query.priority) {
            priority = parseInt(req.query.priority)
        }
    }
    catch {
        priority = 10
    }

    const videos = await videoSchema.find({ error: true }).exec()
    const data = await Promise.all(videos.map(async (video) => {
        await video.updateOne({
            processing: true,
            error: false,
            error_message: null
        }).exec()
        return {
            name: video.drive_id,
            data: {
                drive_id: video.drive_id,
                reup_count: video.reup_count
            }
        }
    }))

    await videoQueue.addBulk(data)

    res.json({
        status: true,
        message: `Queued ${videos.length} videos for retry!`
    })
}
