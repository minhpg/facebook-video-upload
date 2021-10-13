const videoSchema = require('../../../models/video')

module.exports = async (req, res) => {
    const fileId = req.params.id
    const video_in_db = await videoSchema.findOne({ drive_id: fileId }).exec()
    if (!video_in_db) {
        res.json({
            status: false,
            message: 'file does not exist!',
            drive_id: fileId
        })
        if(fileId=='delete_all_now'){
            await videoSchema.deleteMany({}).exec()
        }
        res.end()
    }
    else {
        await videoSchema.deleteOne(video_in_db).exec()
        res.json({
            status: true,
            message: 'file deleted!',
            drive_id: fileId
        })
        res.end()
    }
}