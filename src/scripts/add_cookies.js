const mongoose = require('mongoose');
const cookieSchema = require('../models/cookie')
const fs = require('fs')
require('dotenv').config()

mongoose.connect(process.env.MONGO_DB || 'mongodb://127.0.0.1/facebook', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });


(async() => {
    if(!fs.existsSync('cookies.json')){
        throw new Error('`cookies.json` does not exist')
    }
    const cookie_data = JSON.parse(await fs.promises.readFile('cookies.json'))
    const promises = cookie_data.map(item => {
        const new_cookie = new cookieSchema({
            name: item.name,
            data: item.data,
            disabled: false
        })
        return new_cookie.save()
    })
    await Promise.all(promises)
    mongoose.disconnect();
})()
