const redis = require('async-redis')
require('dotenv').config()
const client = redis.createClient(require('./redis_connection'));

client.on('error', (error) => {
  console.error(error);
})

module.exports = client