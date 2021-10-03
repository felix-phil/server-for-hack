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
	mediaType: {
		type: String
	},
	mediaUrl: {
		type: String
	},
	mediaThumnailUrl:{
		type: String
	},
	parent: {
		type: mongoose.Types.ObjectId,
		ref: "Message"
	}
}, {timestamps: true})

const Message = mongoose.model("Message", MessageSchema)

module.exports = Message
