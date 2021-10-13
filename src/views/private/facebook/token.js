const got = require('got')


const getFullToken = async (cookie) => {
    const headers = {
        'Cookie': cookie,
        'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
        'cache-control': 'max-age=0',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'sec-ch-ua-mobile': '?0',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'viewport-width': '1366',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36'
    }
    url = 'https://m.facebook.com/composer/ocelot/async_loader/?publisher=feed'
    const response = await got.get(url,{headers:headers})
    body = response.body.replace(/\\/g,'')
    components = body.split('"accessToken":"')
    token = components[1].split('","useLocalFilePreview":true,')[0]
    return token
}

const getToken = async (cookie) => {
    const access_token = await getFullToken(cookie)
    url = `https://graph.facebook.com/v11.0/me/accounts?access_token=${access_token}`
    const response = await got.get(url).json()
    data = response.data.map((token) => {
        return {
            name: token.name,
            access_token: token.access_token,
            id: token.id
        }
    })
    return data
}

module.exports = getToken