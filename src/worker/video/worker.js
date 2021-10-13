const fs = require('fs')

const download = require('./download')
const { randomAccount } = require('../../utils')
const { videoQueue, accountQueue } = require('../../queue')


const ResumableUpload = require('./upload/resumable') // Resumable Upload API
const SingleUpload = require('./upload/single') // Single Request Upload API

const FacebookUploadError = require('./upload/error')

SIZE_LIMIT = 9 * 100 * 1024 * 1024 // ~900MB - Actual Graph API limit for single request upload is 1GB

const pauseQueue = async () => {
    if (!await videoQueue.isPaused()) {
        await videoQueue.pause()
    }
}


module.exports = async (file_id, reup_count) => {
    const account = await randomAccount()
    if (!account) {
        await pauseQueue()
        throw new Error('No upload accounts available!')
    }
    const file_meta = await download(file_id)
    const file_stat = await fs.promises.stat(file_meta.filename)
    const file_size = file_stat.size - reup_count // Calculate file size after truncate
    await fs.promises.truncate(file_meta.filename, file_size) // Truncate to change MD5 of file after retry

    try {
        let video_id
        if (file_size < SIZE_LIMIT) { // If below SIZE_LIMIT, use single request upload to optimize request use (200 req/account/hour)
            try {
                let upload = new SingleUpload(file_meta.filename, file_size, account.id, account.token)
                await upload.init()
                video_id = await upload.exec()
            }
            catch (err) {
                if (fs.existsSync(file_meta.filename)) {
                    await fs.promises.unlink(file_meta.filename)
                }
                throw err
            }

        }
        else {
            try {
                let upload = new ResumableUpload(file_meta.filename, file_size, account.id, account.token)
                await upload.init()
                const file_paths = upload.chunks
                await upload.start()
                await upload.transfer()
                video_id = await upload.finish()
            } catch (err) {
                for (const chunk of file_paths) {
                    if (fs.existsSync(chunk)) {
                        await fs.promises.unlink(chunk)
                    }
                }
                throw err
            }
        }

        file_meta.video_id = video_id
        file_meta.group_id = account.id

        return file_meta

    }
    catch (err) {
        if (err instanceof FacebookUploadError) {
            if (err.code == 368) {
                await account.updateOne({ disabled: true }).exec()
                await accountQueue.add(account._id, { id: account._id },{
                    delay: 1000 * 60 * 60 * 3
                })
            }
        }
        throw err
    }
}

