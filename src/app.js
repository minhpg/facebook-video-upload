const express = require('express')
const mongoose = require('mongoose')
const fs = require('fs')
const app = express()
require('dotenv').config()


mongoose.connect(process.env.MONGO_DB || 'mongodb://127.0.0.1/facebook', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

app.use('/', require('./views'))
app.use('/static', express.static('static'))
app.get('/favicon.ico',  (_,res) => {
    res.setHeader('content-type','image/x-icon')
    fs.createReadStream('static/favicon.ico').pipe(res)
})

app.set('view engine', 'ejs')


const PORT = process.env.PORT || 3000

app.listen(PORT, async () => {
    console.log('Started Facebook Tool on port ' + PORT)
})