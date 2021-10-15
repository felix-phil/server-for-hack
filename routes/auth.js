const express = require("express")
const authCont = require("../controllers/auth")
const { body } = require("express-validator")
const router = express.Router()
const isAuth = require("../middlewares/isAuth")
const isSameDevice = require("../middlewares/isSameDevice")

router.post("/lookup/phone", [
	body("phoneNumber", "Enter valid number").isString().notEmpty(),
	body("countryCode", "Enter valid country code").isString().notEmpty()
], authCont.checkNumber)

router.post("/authenticate", [
	body("phone").custom(val => {
		if (!/^\+(?:[0-9] ?){6,14}[0-9]$/.test(val)) {
			return false
		}
		return true
	}).withMessage("Use a vailid phone number").notEmpty().withMessage("Phone number can't be empty"),
	body("channel", "channel not valid").notEmpty().custom(value => {

		const range = ["sms", "call"]
		try {

			if (!range.includes(value.toLowerCase())) {
				return Promise.reject("Invalid Channel")
			}
		} catch (err) {
			return Promise.reject("Invalid Channel")
		}
		return true
	}),
	body("deviceId", "Enter valid device ID").trim().notEmpty()
],
	authCont.authenticate)

router.post("/verify", authCont.verifyOTP)

router.post("/refresh", [
	body("refreshToken").isString().withMessage("Supply a valid refresh token!").notEmpty().withMessage("Refresh Token is required!")
], authCont.refreshToken)

router.post("/sync", isAuth, isSameDevice, authCont.syncContacts)
router.get("/profile/:phoneNumber", isAuth, isSameDevice, authCont.getProfile)
module.exports = router
