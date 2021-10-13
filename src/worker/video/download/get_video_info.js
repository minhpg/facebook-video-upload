const request = require('request-promise');
const { getProxyTxt } = require('../../../utils')

module.exports = async (fileid) => {
    const proxy = await getProxyTxt()
    return request({
        url: 'https://docs.google.com/get_video_info?docid=' + fileid,
        method: "GET",
        proxy: proxy,
        resolveWithFullResponse: true,
        headers: {
            'Cookie': process.env.DRIVE_COOKIE,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36'
        },
    })
}