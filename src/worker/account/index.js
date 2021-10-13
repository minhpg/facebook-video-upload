const { Worker } = require('bullmq')
const mongoose = require('mongoose')
require('dotenv').config()

const accountSchema = require('../../models/account')
const { videoQueue, connection } = require('../../queue')

mongoose.connect(process.env.MONGO_DB || 'mongodb://127.0.0.1/facebook', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false });

console.log('Started Facebook Account Worker')

const resumeQueue = async () => {
    if (await videoQueue.isPaused()) {
        await videoQueue.resume()
    }
}

const worker = new Worker('account', async (job) => {
    const account = await accountSchema.findOne({ _id: job.data.id }).exec()
    if (account) {
        await account.updateOne({ disabled: false }).exec()
        await resumeQueue()
    }
    else {
        throw new Error(`account not found - ${job.data.id}`)
    }
}, {
    concurrency: 1,
    connection: connection
})

worker.on('completed', async (job) => {
    console.log(`${job.id} has completed!`)
})

worker.on('failed', async (job, err) => {
    console.log(`${job.id} has failed with ${err.message}`)
})
