const accountSchema = require('./models/account')
const cookieSchema = require('./models/cookie')
const fs = require('fs')
const got = require('got')

const randomAccount = async () => {
    query = {
        disabled: false
    }
    const count = await accountSchema.countDocuments(query).exec()
    const random = Math.floor(Math.random() * count)
    const account = await accountSchema.findOne(query).skip(random).exec()
    return account
}

const randomCookie = async () => {
    query = {
        disabled: false
    }
    const count = await cookieSchema.countDocuments(query).exec()
    const random = Math.floor(Math.random() * count)
    const account = await cookieSchema.findOne(query).skip(random).exec()
    return account
}


const getAccount = async (group_id) => {
    query = {
        id: group_id
    }
    const count = await accountSchema.countDocuments(query).exec()
    const random = Math.floor(Math.random() * count)
    const account = await accountSchema.findOne(query).skip(random).exec()
    return account
}

const getCookie = async (group_id) => {
    const account = await getAccount(group_id)
    const parent_cookie = await cookieSchema.findOne({ _id: account.parent }).exec()
    return parent_cookie
}


const getProxyTxt = async () => {
    const obj = await got.get('https://actproxy.com/proxy-api/6b976c53bf613cb6091286db34866c2e_12957-31010?format=json&userpass=true').json()
    var proxy = obj[Math.floor(Math.random() * obj.length)].split(';')
    console.log(`http://${proxy[1]}:${proxy[2]}@${proxy[0]}`)
    return `http://${proxy[1]}:${proxy[2]}@${proxy[0]}`
}

const getProxyJSON = async () => {
    const data = await fs.promises.readFile('proxies.json')
    var obj = JSON.parse(data)
    const { ip, port, isp, city } = obj[Math.floor(Math.random() * obj.length)];
    console.log(`Using proxy ${ip}:${port} by ${isp} at ${city}`)
    return `http://${ip}:${port}`
}


module.exports = {
    getAccount, getCookie, getProxyJSON, getProxyTxt, randomAccount, randomCookie
}