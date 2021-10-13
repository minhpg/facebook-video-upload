const express = require('express')
const router = express.Router()

const { videoQueue } = require('../../queue')

router.get('/stat', async (req, res) => {
    try {
        const counts = await videoQueue.getJobCounts('wait', 'completed', 'failed')
        res.json({
            status: true,
            data: counts
        })
    }
    catch (err) {
        res.json({
            status: false,
            message: err.message
        })
    }

})

router.get('/remove/:job_id', async (req, res) => {
    await videoQueue.remove(job.id);
})

router.get('/pause', async (req, res) => {
    try {
        if (!await videoQueue.isPaused()) {
            await videoQueue.pause()
        }
        else {
            throw new Error('Queue not running!')
        }
        res.json({
            status: true,
            message: 'Video queue paused!'
        })
    }
    catch (err) {
        res.json({
            status: false,
            message: err.message
        })
    }
})

router.get('/resume', async (req, res) => {
    try {
        if (await videoQueue.isPaused()) {
            await videoQueue.resume()
        }
        else {
            throw new Error('Queue running!')
        } 
        res.json({
            status: true,
            message: 'Video queue resumed!'
        })
    }
    catch (err) {
        res.json({
            status: false,
            message: err.message
        })
    }
})


module.exports = router