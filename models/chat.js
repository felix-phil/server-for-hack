const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ChatSchema = new Schema({
	participants: [{type: mongoose.Types.ObjectId, ref: "User", unique: true}],
	createdBy: {
		type: mongoose.Types.ObjectId,
		ref: "User",
		required: true
	}, messages: [{ type: mongoose.Types.ObjectId, ref: "Message"  }]
}, {timestamps: true})

const Chat = mongoose.model('Chat',ChatSchema )

module.exports = Chat
