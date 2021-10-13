const mongoose = require('mongoose');

const cookieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    data: {
        type: String,
        required: true
    },
    disabled: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('cookies', cookieSchema)