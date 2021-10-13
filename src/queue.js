const { Queue, QueueScheduler } = require('bullmq')
const connection = require('./redis_connection')

const videoQueue = new Queue('video',{connection: connection})
const accountQueue = new Queue('account',{connection: connection})
const accountQueueScheduler = new QueueScheduler('account',{connection: connection})

module.exports = {
    videoQueue,
    accountQueue,
    connection
}