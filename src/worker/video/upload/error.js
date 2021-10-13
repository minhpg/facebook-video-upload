
ERRORS = {
    368: 'The action attempted has been deemed abusive or is otherwise disallowed',
    600: 'There was a problem uploading your video. Please try again.',
    6000: 'There was a problem uploading your video file. Please try again with another file.',
    100: 'Invalid parameter',
    190: 'Invalid OAuth 2.0 Access Token',
    200: 'Permissions error',
    459: 'The session is invalid because the user has been checkpointed',
    324: 'Missing or invalid image file',
    356: 'There was a problem uploading your video file. Please try again.',
    352: 'The video format is not supported. Please check spec for supported video formats'
}


class UploadError extends Error {

    constructor(error_code) {
        const message = ERRORS[parseInt(error_code)]
        super(message)
        this.name = 'FacebookUploadError'
        this.code = error_code
    }
}

module.exports = UploadError
