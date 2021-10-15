const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ChatSchema = new Schema({
	participants: [
		{ 
		_id: false,
		user:{ type: mongoose.Types.ObjectId, ref: "User"}
		}
	],
	createdBy: {
		type: mongoose.Types.ObjectId,
		ref: "User",
		required: true
	}, 
}, {timestamps: true})

const Chat = mongoose.model('Chat',ChatSchema )

module.exports = Chat
