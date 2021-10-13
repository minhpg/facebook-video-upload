const rp = require('request-promise')
const { getProxyTxt } = require('../../../utils')

const getPage = async (url) => {
    const proxy = await getProxyTxt()
    const options = {
        url: url,
        headers: {
            'Cookie' : process.env.DRIVE_COOKIE,
            'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
        },
        resolveWithFullResponse: true,
        proxy: proxy
    };
    response = await rp(options)
    return response.body
}

const getThumbnailUrl = async (id) => {
    try {
        const page = await getPage(`https://drive.google.com/file/d/${id}`)
        if (page.indexOf('<title>https://drive.google.com/file/d/') > 0) {
            throw new Error('ip blocked')
        }
        const json_data = getStringUrl('itemJson: ', '"]', page)
        const image_url = decodeURIComponent(JSON.parse(`"${'https://lh3.googleusercontent.com'+getStringUrl('googleusercontent.com', '",null',json_data)}"`))
        return image_url
    }
    catch (err){
        console.error(err.message)
        return null
    }
}

const getStringUrl = (start, end, body) => {
    component = body.split(start)[1];
    component = component.split(end)[0];
    return component
}

module.exports = getThumbnailUrl