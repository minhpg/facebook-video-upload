const getVideoInfo = require('./get_video_info')
const aria = require('./aria2c')
const parseStream = require('./parse')

module.exports = async (fileid) => {
    const response = await getVideoInfo(fileid)
    const cookies = response.headers['set-cookie']
    if(process.env.DRIVE_COOKIE){
        cookies.push(process.env.DRIVE_COOKIE)
    }
    const data = parseStream(response.body)
    const video = data.streams[0]
    video.filename = fileid
    console.log(`Downloading "${data.title}" - ${video.filename}`)
    filename = await aria(video,cookies)
    return {
        title: data.title,
        filename: filename,
    }
}