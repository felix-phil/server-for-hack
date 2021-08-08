const jwt = require("jsonwebtoken")

const User = require("../models/user")

const client = require('twilio')(process.env.TWL_SID, process.env.TWL_AUTH_TOKEN);

exports.authenticate = async(req, res, next) => {
	const { phone, channel, deviceId  } = req.body;
	try {
	const verification = await client.verify.services(process.env.TWL_AUTH_SERVICE_ID).verifications.create({
		to:phone, channel:channel
	});
	
	let theUser;
	if(verification && verification.to){
		const user = await User.findOne({phone: verification.to})
		if(!user){
			const newUser = new User({
			phone:verification.to,
			deviceId:deviceId,
			tokenVerify: verification.sid,
			tokenVerifyDate: verification.dateCreated
			})
			await newUser.save()
			theUser = newUser
		}else{
		user.tokenVerify = verification.sid;
		user.tokenVerifyDate = verification.dateCreated;
		user.deviceId= deviceId;
		await user.save()
		theUser = user
		}
		res.status(201).json({
		message: "OTP sent",
		phone: theUser.phone,
		})

	}
	}catch(err){
		console.log(err)
	}
}



exports.verifyOTP = async(req, res, next) => {
	const {code, deviceId, phone} = req.body
	try{

        const verification_check = await client.verify.services(process.env.TWL_AUTH_SERVICE_ID).verificationChecks.create({
                to:phone, code:code
        })
	if(verification_check && verification_check.status ==="approved") {
	const user = await User.findOne({tokenVerify: verification_check.sid})
	if(!user){
	const error = new Error("User does not exist")
		error.status = 400
		throw error
	}
	if(user.deviceId !== deviceId){
		const error = new Error("Security breach, not same device!")
		error.status = 403
		throw error
	}
	user.is_active = true
	user.tokenVerify = null
	user.tokenVerifyDate = null
	await user.save()
	const userData = { phone: user.phone, firstName: user.firstName, lastName: user.lastName, email: user.email, status: user.status }
	const accessToken = jwt.sign({user: userData}, process.env.JWT_SECRET)
	res.status(200).json({token:accessToken, user: userData})
	}
	}catch(err){
		if(!err.status){
			err.status = 500
		}
		console.log(err)
		next(err)
	}
}
