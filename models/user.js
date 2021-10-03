const mongoose = require("mongoose")
const Schema = mongoose.Schema
const UserSchema = new Schema({
	phone: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: false
	},
	firstName: {
		type: String,
	},
	lastName: {
		type: String,
	},
	status: {
		type: String,
		default: "Hi, I'm new here"
	},
	deviceId: {
		type: String
	},
	is_active: {
		type: Boolean,
		default: false
	},
	tokenVerify: {
		type: String
	},
	tokenVerifyDate: {
		type: Date
	},
	dateJoined: {
		type: Date,
		default: Date.now()
	},
	lastSeen: {
		type: Date,
		required: false
	},
	contacts: [{
		_id: false,
		user: {
			type: mongoose.Types.ObjectId,
			ref: "User"
		},
		contactAliasName: {
			type: String
		}
	}],
	profileImage: {
		type: String,
		default: '/profile_images/default.png'
	}
}, { timesamps: true })

const User = mongoose.model("User", UserSchema
)

module.exports = User
