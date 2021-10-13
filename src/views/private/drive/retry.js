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

    const fileId = req.params.id
    const video_in_db = await videoSchema.findOne({ drive_id: fileId }).exec()
    if (!video_in_db) {
        res.json({
            status: false,
            message: 'file does not exist',
            drive_id: fileId
        })
        res.end()
    }
    else {
        await video_in_db.updateOne({
            processing: true,
            error: false,
            error_message: null
        }).exec()
        await videoQueue.add(fileId, { drive_id: fileId, reup_count: video_in_db.reup_count }, { priority: priority })
        res.json({
            status: true,
            message: 'file queued',
            drive_id: fileId
        })
        res.end()
    }
}