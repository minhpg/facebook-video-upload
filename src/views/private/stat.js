const videoSchema = require('../../models/video')
const accountSchema = require('../../models/account')
const cookieSchema = require('../../models/cookie')

const express = require('express')
const router = express.Router()


router.get('/videos', async (req,res) => {
    const in_queue = await videoSchema.find({processing:true}).countDocuments().exec()
    const done = await videoSchema.find({video_id:{$exists:true},processing:false,error:false}).countDocuments().exec()
    const errors = await videoSchema.find({error:true}).countDocuments().exec()
    res.json({
        status: true,
        data: {
            in_queue: in_queue,
            done: done,
            errors: errors
        }
    })
})

router.get('/done', async (req,res) => {
    const done = await videoSchema.find({video_id:{$exists:true},processing:false,error:false},{_id:false,__v:false}).limit(100).exec()
    res.json({
        status: true,
        data: done
    })
})

router.get('/queued', async (req,res) => {
    const in_queue = await videoSchema.find({processing:true,error:false},{_id:false,__v:false}).limit(100).exec()
    res.json({
        status: true,
        data: in_queue
    })
})

router.get('/errors', async (req,res) => {
    const errors = await videoSchema.find({error:true},{_id:false,__v:false}).limit(100).exec()
    res.json({
        status: true,
        data: errors
    })
})

router.get('/tokens', async (req,res) => {
    const tokens = await accountSchema.find({},{_id:false,__v:false}).exec()
    res.json({
        status: true,
        data: tokens
    })
})

router.get('/cookies', async (req,res) => {
    const cookies = await cookieSchema.find({},{_id:false,__v:false}).exec()
    res.json({
        status: true,
        data: cookies
    })
})

module.exports = router