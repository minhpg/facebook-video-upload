const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cookies'
    },
    disabled: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('accounts', accountSchema)