const got = require('got')

const changeDomain = (old) => {
    var url = new URL(old)
    url.hostname = 'scontent.xx.fbcdn.net'
    // url.pathname = url.pathname.replace(/\/\//g,'/')
    return url.href.replace(/u0025/g, '%')
}

const GraphAPI = async (video_id, token) => {
    const url = `https://graph.facebook.com/v1.0/${video_id}?fields=source&access_token=${token}`
    try {
        const response = await got.get(url).json()
        stream_url = response.source
        if (stream_url) {
            stream_url = changeDomain(stream_url)
            return stream_url
        } else {
            return null
        }
    }
    catch (err) {
        if (err.response) {
            console.error(err.response.body)
        }
        throw err
    }
}


const extractQualities = (response_text) => {
    qualities = []
    try {
        components = response_text.split(',"playable_url_quality_hd":"')
        hd = components[1].split('",')[0]
        qualities.push({
            label: 'HD',
            type: 'video/mp4',
            file: changeDomain(hd)
        })
    }
    catch (err) {
    }
    try {
        components = response_text.split(',"playable_url":"')
        sd = components[1].split('",')[0]
        qualities.push({
            label: 'SD',
            type: 'video/mp4',
            file: changeDomain(sd)
        })
    }
    catch (err) {
    }
    return qualities
}

const unescapeSlashes = (str) => {
    let parsedStr = str.replace(/(^|[^\\])(\\\\)*\\$/, "$&\\");
    parsedStr = parsedStr.replace(/(^|[^\\])((\\\\)*")/g, "$1\\$2");
  
    try {
      parsedStr = JSON.parse(`"${parsedStr}"`);
    } catch(e) {
      return str;
    }
    return parsedStr ;
  }

const extractDash = (response_text) => {
    try {
        components = response_text.split(',"dash_manifest":"')
        dash_data = components[1].split('",')[0]
        dash_data = unescapeSlashes(dash_data).replace(/[^/]+.[^/]+.fbcdn.net/g,'video.xx.fbcdn.net')
        return dash_data //.replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, `"`)
    }
    catch (err) {
        return null
    }
}


const StoryAPIRequest = async (video_id, page_id, cookie) => {
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
    const url = `https://www.facebook.com/permalink.php?story_fbid=${video_id}&id=${page_id}`
    const response = await got.get(url, {
        headers: headers
    })
    body = response.body
    return body
}

const StoryAPI = async (video_id, page_id, cookie) => {
    try {
        const response = await StoryAPIRequest(video_id, page_id, cookie)
        parse_response = response.replace(/\\/g,'')
        const qualities = extractQualities(parse_response)
        if (qualities.length > 0) {
            // console.log(qualities)
            return qualities
        } else {
            throw new Error('no quality available!')
        }
    }
    catch (err) {
        if (err.response) {
            console.error(err.response.body)
            throw err
        }
        else {
            throw new Error('no quality available')
        }
    }
}

const DashAPI = async (video_id, page_id, cookie) => {
    try {
        const response = await StoryAPIRequest(video_id, page_id, cookie)
        parsed_response = unescape(response.replace(/\\u([\d\w]{4})/gi, (match, grp) => {
            return String.fromCharCode(parseInt(grp, 16));
        }))
        const dash_data = extractDash(parsed_response)
        if (dash_data) {
            // console.log(dash_data)
            // await require('fs').promises.writeFile('test.mpd',dash_data)
            return dash_data
        } else {
            throw new Error('no quality available!')
        }
    }
    catch (err) {
        console.log(err)
        if (err.response) {
            console.error(err.response.body)
            throw err
        }
        else {
            throw new Error('no quality available')
        }
    }
}

// DashAPI('1228668320936198', '104345635319129', 'sb=qtEfYQNzznEO7Lv_9PgBCe3r; datr=qtEfYbla_Wl7DAaD2GW7orX3; c_user=100063711224823; _fbp=fb.1.1630336353829.406273774; spin=r.1004353959_b.trunk_t.1630905016_s.1v.2; presence=EDvF3EtimeF1630906048EuserFA21B63711224823A2EstateFDutF0CEchF_7bCC; m_pixel_ratio=1; x-referer=eyJyIjoiL1VwbG9hZC1hdnMtMTAwNzYxMzgyMzI5OTU1Lz9yZWY9Ym9va21hcmtzIiwiaCI6Ii9VcGxvYWQtYXZzLTEwMDc2MTM4MjMyOTk1NS8%2FcmVmPWJvb2ttYXJrcyIsInMiOiJtIn0%3D; usida=%7B%22ver%22%3A1%2C%22id%22%3A%22Aqz0gvw1r9texx%22%2C%22time%22%3A1630929020%7D; xs=6%3AD50YGyS92ttCPg%3A2%3A1629475256%3A-1%3A-1%3A%3AAcW7OHwow949vRK085q9oR-r8BMzapToS9GKrHAK3CY; fr=1GM32kP83lH0WAEbJ.AWV8J6afpqaRlo4TIQ0kozaWjFY.BhNh46.-R.AAA.0.0.BhNh46.AWWgFf_aMpw; wd=1366x657')

module.exports = {
    GraphAPI,
    StoryAPI,
    DashAPI
}