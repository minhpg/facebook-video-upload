const mongoose = require('mongoose');
const cookieSchema = require('../models/cookie')
const accountSchema = require('../models/account')
const getToken = require('../views/private/facebook/token')
require('dotenv').config()

mongoose.connect(process.env.MONGO_DB || 'mongodb://127.0.0.1/facebook', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });


(async () => {
    const cookies = await cookieSchema.find({}).exec()
    for (const cookie of cookies) {
        try {
            const pages = await getToken(cookie.data)
            console.log(pages)
            for (const page of pages) {
                const new_account = new accountSchema({
                    name: page.name,
                    id: page.id,
                    parent: cookie._id,
                    token: page.access_token,
                    disabled: false
                })
                await new_account.save()
            }
    
        }
        catch (err) {
            console.error(err.message)

        }
    }
    mongoose.disconnect();
})()
