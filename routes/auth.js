const express = require("express") 
const authCont = require("../controllers/auth")

const router = express.Router()

router.post("/authenticate",
	authCont.authenticate)

router.post("/verify", authCont.verifyOTP)
module.exports = router
