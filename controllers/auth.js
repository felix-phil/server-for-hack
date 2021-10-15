const jwt = require("jsonwebtoken")
const { validationResult } = require("express-validator")
const User = require("../models/user")
const TokenGen = require("../utils/token-generator");
const mongoose = require("mongoose")
const { throwNewError } = require("../utils/easyfunctions");

const client = require('twilio')(process.env.TWL_SID, process.env.TWL_AUTH_TOKEN);

exports.checkNumber = async (req, res, next) => {
	const { countryCode, phoneNumber } = req.body
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			throwNewError("Validation Failed", 400, errors.array())
		}
		const phoneNumberDetails = await client.lookups.phoneNumbers(countryCode + phoneNumber).fetch()
		if (!phoneNumberDetails) {
			throwNewError("Invalid Phone Number", 400, [])
		}
		const formattedPhoneString = countryCode + " " + phoneNumberDetails.nationalFormat.substring(1)
		res.status(200).json({ nationalFormat: phoneNumberDetails.nationalFormat, phoneNumber: phoneNumberDetails.phoneNumber, formattedPhoneString })
	} catch (error) {
		if(!error.status){
			error.status = 500
		}
		next(error)
	}
}

exports.authenticate = async (req, res, next) => {
	const { phone, channel, deviceId } = req.body;
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const error = new Error("Validataion failed!");
			error.status = 400;
			error.data = errors.array()
			throw error;
		}
		const verification = await client.verify.services(process.env.TWL_AUTH_SERVICE_ID).verifications.create({
			to: phone, channel: channel
		});

		let theUser;
		if (verification && verification.to) {
			const user = await User.findOne({ phone: verification.to })
			if (!user) {
				const newUser = new User({
					phone: verification.to,
					deviceId: deviceId,
					tokenVerify: verification.sid,
					tokenVerifyDate: verification.dateCreated
				})
				await newUser.save()
				theUser = newUser
			} else {
				user.tokenVerify = verification.sid;
				user.tokenVerifyDate = verification.dateCreated;
				user.deviceId = deviceId;
				await user.save()
				theUser = user
			}
			res.status(201).json({
				message: "OTP sent",
				phone: theUser.phone,
			})

		}
	} catch (err) {
		if (!err.status) {
			err.status = 500
		}                                         //  console.log(err)
		next(err)
	}
}

exports.verifyOTP = async (req, res, next) => {
	const { code, deviceId, phone } = req.body
	try {

		const verification_check = await client.verify.services(process.env.TWL_AUTH_SERVICE_ID).verificationChecks.create({
			to: phone, code: code
		})
		if (verification_check && verification_check.status === "approved") {
			const user = await User.findOne({ tokenVerify: verification_check.sid })
			if (!user) {
				const error = new Error("User does not exist")
				error.status = 400
				throw error
			}
			if (user.deviceId !== deviceId) {
				const error = new Error("Security breach, not same device!")
				error.status = 403
				throw error
			}
			user.is_active = true
			user.tokenVerify = null
			user.tokenVerifyDate = null
			await user.save()
			const userData = { _id: user._id, phone: user.phone, firstName: user.firstName, lastName: user.lastName, email: user.email, status: user.status }
			//const accessToken = jwt.sign({user: userData}, process.env.JWT_SECRET)
			const tokenGen = new TokenGen(process.env.JWT_SECRET, process.env.JWT_SECRET, { expiresIn: "6h" })
			const accessToken = tokenGen.sign({ user: userData })
			setTimeout(function () {
				const refreshToken = tokenGen.refresh(accessToken, {})
				res.status(200).json({ token: accessToken, refresh: refreshToken, user: userData })
			}, 2000)
		}
	} catch (err) {
		if (!err.status) {
			err.status = 500
		}
		console.log(err)
		next(err)
	}
}

exports.refreshToken = async (req, res, next) => {
	const { refreshToken, deviceId } = req.body

	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			throw throwNewError("Validation failed!", 400, errors.array())
		}
		const decoded = await jwt.decode(refreshToken)
		if (!decoded) {
			throw throwNewError("Invalid refresh token or expired!", 400)
		}
		const user = await User.findById(decoded.user._id)
		if (!user) {
			throw throwNewError("No user found with the given refresh token!", 404)
		}
		if (user.deviceId !== deviceId) {
			throw throwNewError("Security breach, not same device!", 403)
		}
		const userData = { _id: user._id, phone: user.phone, firstName: user.firstName, lastName: user.lastName, email: user.email, status: user.status }
		const tokenGen = new TokenGen(process.env.JWT_SECRET, process.env.JWT_SECRET, { expiresIn: "6h" })
		const accessToken = tokenGen.sign({ user: userData })
		setTimeout(function () {
			const refreshToken = tokenGen.refresh(accessToken, {})
			// res.status(200).json({ token: accessToken, refresh: refreshToken, user: userData })
			res.status(200).json({ token: accessToken, refresh: refreshToken })
		}, 2000)


	} catch (error) {
		if (!error.status) {
			error.status = 500
		}
		next(error)
	}
}
exports.syncContacts = async (req, res, next) => {
	const { contacts } = req.body
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			throw throwNewError("Validation failed!", 400, errors.array())
		}
		let verifiedContact = [];
		for (const con of contacts) {
			const regex = new RegExp(con.phoneNumber, 'i')
			const user = await User.findOne({ phone: { $regex: regex, $ne: req.user.phone } })
			if (user) {
				verifiedContact.push({ firstName: user.firstName, lastName: user.lastName, phone: user.phone, image: user.profileImage, status: user.status, contactSystemId: con.id, aliasName: con.name, userId: user._id })
			}
		}

		if (verifiedContact.length > 0) {
			for (const con of verifiedContact) {
				const contactExists = req.user.contacts.find(conta => conta.user._id.toString() === con.userId.toString())
				if (!contactExists) {
					req.user.contacts.push({ user: con.userId, contactAliasName: con.aliasName })
				}
			}
			await req.user.save()
		}
		res.status(200).json({ contacts: verifiedContact, currentContact: req.user.contacts })
	} catch (error) {
		if (!error.status) {
			error.status = 500
		}
		next(error)
	}
}

exports.getProfile = async (req, res, next) => {
	const phoneNumber = req.params.phoneNumber
	if(!phoneNumber){
		throw throwNewError("User phone number not provided", 400, [])
	}
	try{
		const user = await User.findOne({ phone: phoneNumber })
		if(!user){
			throw throwNewError("User profile does not exists!", 404, [])
		}
		res.status(200).json({ phone: user.phone, firstName: user.firstName, status: user.status, profileImage: user.profileImage, lastSeen: user.lastName })
	}catch(error){
		if(!error.status){
			error.status=500
		}
		next(error)
	}
}