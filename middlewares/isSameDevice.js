const User = require("../models/user")

const isSameDevice = (req, res, next) => {
	try{
		const deviceHeader = req.headers.device
		if(!deviceHeader){
			const error = new Error("Device credentials not attached!")
			error.status = 403
			throw error
		}
	const deviceId = deviceHeader.split(" ")[1]
	if(!deviceId){
		const error = new Error("Device credentials not attached!")
		error.status = 403
		throw error
	}
	if(deviceId !== req.user.deviceId){
		const error = new Error("Invalid device. Did you change your device ? Login again to access your files")
		error.status = 403
		throw error
	}
	next()
	}catch(error){
		if(!error.status){
			error.status = 500
		}
		next(error)
	}
}
module.exports = isSameDevice
