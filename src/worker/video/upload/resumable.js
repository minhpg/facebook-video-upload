const fs = require('fs')
const path = require('path')
const uuid = require('uuid')
const rp = require('request-promise')
const splitFile = require('split-file')
const prettyBytes = require('pretty-bytes')

const { getProxyTxt } = require('../../../utils')

const FacebookUploadError = require('./error')

module.exports = class {

    constructor(file_path, file_size, page_id, token) {
        this.retryMax = 3
        this.chunkSize = 50 * 1024 * 1024 // 50MB
        this.title = uuid.v4()
        this.file_path = file_path
        this.file_name = path.basename(file_path)
        this.page_id = page_id
        this.token = token
        this.rest_default = 'https://graph-video.facebook.com/v9.0' // Video GraphAPI endpoint
        this.rest_url = `${this.rest_default}/${this.page_id}/videos`
        this.file_size = file_size

    }

    get chunks() {
        return this.file_paths
    }

    async request() {
        try {
            const response = await rp(this.options)
            return response
        }
        catch (err) {
            if (err.response) {
                throw new FacebookUploadError(err.response.body.error.code)
            }
            else {
                throw err
            }
        }
    }

    async init() {
        this.file_paths = await splitFile.splitFileBySize(this.file_path, this.chunkSize)

        await fs.promises.unlink(this.file_path)
        this.options = {
            method: 'POST',
            uri: this.rest_url,
            json: true,
        }

        if(process.env.USE_PROXY_UPLOAD){
            this.proxy = await getProxyTxt()
            this.options.proxy = this.proxy
        }
        this.file_size_readable = prettyBytes(this.file_size)

        console.log(`Resumable - Uploading ${this.file_path} - ${this.file_size_readable} to ${this.page_id} - Proxy: ${this.proxy}`)
    }

    async start() {
        const form = {
            access_token: this.token,
            upload_phase: 'start',
            file_size: this.file_size
        }

        this.options.form = form

        const response = await this.request()

        const { video_id, start_offset, end_offset, upload_session_id } = response

        console.log(`${this.file_path}: ${JSON.stringify(response)}`)

        this.video_id = video_id
        this.start_offset = start_offset
        this.end_offset = end_offset
        this.upload_session_id = upload_session_id
    }

    async transfer() {
        for (const chunk of this.file_paths) {
            if (this.start_offset !== this.end_offset) {
                await this.chunk(fs.createReadStream(chunk))
                await fs.promises.unlink(chunk)
            }
        }
    }

    async chunk(chunk) {
        let retry = 0
        const formData = {
            access_token: this.token,
            upload_phase: 'transfer',
            start_offset: this.start_offset,
            upload_session_id: this.upload_session_id,
            video_file_chunk: {
                value: chunk,
                options: {
                    filename: 'chunk'
                }
            }
        }

        this.options.form = null
        this.options.formData = formData

        while (retry < this.retryMax) {
            try {
                const response = await rp(this.options)
                const { start_offset, end_offset } = response

                this.start_offset = start_offset
                this.end_offset = end_offset

                console.log(`${this.file_path}: Uploaded ${prettyBytes(parseInt(start_offset))} / ${this.file_size_readable}`)

                return
            }
            catch (err) {
                if (err.response) {
                    throw new FacebookUploadError(err.response.body.error.code)
                }
                else {
                    console.error(err.message)
                }
                retry += 1
                continue
            }
        }
        throw new Error('max retries exceeded')
    }

    async finish() {
        const description = this.title
        const form = {
            access_token: this.token,
            upload_phase: 'finish',
            title: this.title,
            description: description,
            upload_session_id: this.upload_session_id
        }

        this.options.formData = null
        this.options.form = form

        await this.request()

        return this.video_id
    }
}

