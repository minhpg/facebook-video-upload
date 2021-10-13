const { Worker } = require('bullmq')
const mongoose = require('mongoose')
const fs = require('fs')


const videoSchema = require('../../models/video')
const uploadProcess = require('./worker')
const messageTelegram = require('./telegram')
const { connection } = require('../../queue')

require('dotenv').config()

mongoose.connect(process.env.MONGO_DB || 'mongodb://127.0.0.1/facebook', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false })

console.log('Started Facebook Video Worker')

const worker = new Worker('video', async job => {
    const fileid = job.data.drive_id
    const reup_count = job.data.reup_count

    console.log(`Video ${fileid} starting - JobId: ${job.id}`)
    await messageTelegram(`Video https://drive.google.com/file/d/${fileid} starting - JobId: ${job.id}`)
    const {title, video_id, group_id} = await uploadProcess(fileid, reup_count)
    await videoSchema.updateOne({ drive_id: fileid }, {
        processing: false,
        error: false,
        title: title,
        video_id: video_id,
        group_id: group_id,
        error_message: null
    }).exec()
    await videoSchema.updateOne({ drive_id: fileid }, { $inc: { reup_count: 1 } })

}, {
    concurrency: 2, 
    connection: connection
})

worker.on('completed', async (job) => {
    await messageTelegram(`https://drive.google.com/file/d/${job.data.drive_id} has completed!`)
    console.log(`${job.data.drive_id} has completed!`)
})

worker.on('failed', async (job, err) => {
    await videoSchema.updateOne({ drive_id: job.data.drive_id }, {
        processing: false,
        error: true,
        error_message: err.message
    }).exec()
    const file_exists = fs.existsSync(job.data.drive_id)
    if(file_exists){
        await fs.promises.unlink(job.data.drive_id)
    }
    await messageTelegram(`https://drive.google.com/file/d/${job.data.drive_id} has failed with ${err.message}`)
    console.log(`${job.data.drive_id} has failed with ${err.message}`)
    console.error(err)
})
