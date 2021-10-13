// const redis = require('redis')
require('dotenv').config()

const connection = {
    port: process.env.REDIS_PORT || 6379,
    host: process.env.REDIS_HOST || 'localhost',
    password: process.env.REDIS_PASSWORD || ''
}

// const client = redis.createClient(connection)

module.exports = connection

