require('dotenv').config()
const mongoose = require('mongoose');
const videoSchema = require('../models/video')
const got = require('got')
mongoose.connect('mongodb://kakao:Hoilamgi1Abc@95.111.192.54:27017/kakao', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });


(async () => {
    const videos = await videoSchema.find({}).skip(0).sort({_id:1}).skip(0).exec()
    for(video of videos){
        const response = await got.get(`http://95.111.192.54/api/private/drive/create/${video.drive_id}?key=${process.env.API_KEY}`).json()
        console.log(response)
    }
    mongoose.disconnect()
})()





