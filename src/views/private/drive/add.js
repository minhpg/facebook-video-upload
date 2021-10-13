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
    const video = await videoSchema.findOne({ drive_id: fileId }).exec()
    if (video) {
        res.json({
            status: false,
            message: 'file exists!',
            drive_id: video.drive_id
        })
        res.end()
    }
    else {
        const new_video = new videoSchema({
            drive_id: fileId,
            processing: true,
            error: false,
            reup_count: 0
        })
        await new_video.save()
        await videoQueue.add(fileId, { drive_id: fileId, reup_count: 0 }, { priority: priority })
        res.json({
            status: true,
            message: 'file created!',
            drive_id: fileId
        })
        res.end()
    }
}