const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title : String,
    drive_id : {
        type: String,
        required: true
    },
    processing: {
        type: Boolean,
        required: true
    },
    error: {
        type: Boolean,
        required: true
    },
    error_message : {
        type: String
    },
    video_id: {
        type: String
    },
    group_id: {
        type: String
    },
    reup_count: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('video', videoSchema)