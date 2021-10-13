const qs = require('querystring')
const uuid = require('uuid')

module.exports = (string) => {
    const data = qs.parse(string)
    if (data.status != 'ok') {
        throw new Error(data.reason)
    }
    else {
        const fmt_stream_map = data.fmt_stream_map
        const parsed = FmtParser(fmt_stream_map)
        const streams = parsed.sort((a, b) => {
                return b.res - a.res
            })
        return {
            'title': data.title,
            'streams': streams
            }
    }
}


const FmtParser = (string) => {
    const list = []
    const videos = string.split(',')
    videos.forEach((item) => {
        const components = item.split('|')
        const itag = parseInt(components[0])
        const res = getVideoResolution(itag)
        if(res<1080){
            list.push({
                'itag': itag,
                'url': components[1],
                'res': res,
                'filename': uuid.v4()+'.mp4'
            })
        }
    })
    return list
}



const getVideoResolution = (itag) => {
    const videoCode = {
        '18': 360,
        '59': 480,
        '22': 720,
        '37': 1080
    }
    return videoCode[itag] || 0
}
