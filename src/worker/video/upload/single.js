const fs = require('fs')
const uuid = require('uuid')
const rp = require('request-promise')
const prettyBytes = require('pretty-bytes')

const { getProxyTxt } = require('../../../utils')
const FacebookUploadError = require('./error')

module.exports = class {

    constructor(file_path, file_size, page_id, token) {
        this.title = uuid.v4()
        this.file_path = file_path
        this.page_id = page_id
        this.token = token
        this.rest_default = 'https://graph-video.facebook.com/v9.0'
        this.rest_url = `${this.rest_default}/${this.page_id}/videos`
        this.file_size = file_size

    }

    async init() {
        this.options = {
            method: 'POST',
            uri: this.rest_url,
            json: true,
        }
        if (process.env.USE_PROXY_UPLOAD) {
            this.proxy = await getProxyTxt()
            this.options.proxy = this.proxy
        }
        this.file_size_readable = prettyBytes(this.file_size)
        console.log(`Single - Uploading ${this.file_path} - ${this.file_size_readable} to ${this.page_id} - Proxy: ${this.proxy}`)
    }

    async exec() {
        const formData = {
            access_token: this.token,
            source: {
                value: fs.createReadStream(this.file_path),
                options: {
                    filename: 'video.mp4',
                    contentType: 'video/mp4'
                }
            }
        }
        this.options.formData = formData
        try {
            const response = await rp(this.options)
            if (response.id) {
                await fs.promises.unlink(this.file_path)
                return response.id
            }
            else {
                console.error(response)
                throw new Error('upload failed')
            }
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

}
