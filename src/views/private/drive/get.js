const videoSchema = require('../../../models/video')

module.exports = async (req,res) => {
    const fileId = req.params.id
    const video = await videoSchema.findOne({drive_id: fileId}).exec()
    if (video) {
        var data = {
            title: video.title,
            in_queue: video.processing,
            error: video.error,
            message: video.error_message
        }
        if(video.video_id){
            data.video_id = video.video_id
            data.group_id = video.group_id
            data.iframe = `${process.env.HOST}/public/iframe/${video._id.toString()}`
        }
        res.json({
            status: true,
            data: data
        })
    }
    else {
        res.json({
            status: false,
            message: 'file does not exist'
        })
    }
    res.end()
}