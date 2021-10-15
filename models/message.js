const mongoose = require("mongoose")
const Schema = mongoose.Schema

const MessageSchema = new Schema({
	message: {
		type: String,
		required: true
	},
	chat: {
		type: mongoose.Types.ObjectId,
		ref: "Chat",
		required: true
	},
	createdBy: {
		type: mongoose.Types.ObjectId,
		ref: "User",
		required: true
	},
	hasMedia: {
		type: Boolean,
		default: false
	},
	parent: {
		type: mongoose.Types.ObjectId,
		ref: "Message"
	},
	media: {
		type: mongoose.Types.ObjectId,
		ref: "Media",
		required: false
	},
}, {timestamps: true})

const Message = mongoose.model("Message", MessageSchema)

module.exports = Message
