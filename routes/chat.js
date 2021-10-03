const express = require("express")
const isAuth = require("../middlewares/isAuth")
const isSameDevice = require("../middlewares/isSameDevice")
const router = express.Router()

router.post("/testauth", isAuth, isSameDevice, (req, res, next)=>{
	res.json({message: "working!", user: req.user})
})
router.get("/test", (req, res, next)=> {
	res.status(200).json({message: "Working!!!"})
})
module.exports = router
