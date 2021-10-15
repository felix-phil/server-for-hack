const mongoose = require("mongoose")
const Schema = mongoose.Schema

const MediaSchema = new Schema({
    mediaUrl: {
        type: String,
        required: true
    },
    mediaThumbnailUrl: {
        type: String,
        required: false
    },
    mediaType: {
        type: String,
        required: true
    },
    createdby: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

const Media = mongoose.model('Media', MediaSchema)

module.exports = Media