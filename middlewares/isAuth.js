const jwt = require("jsonwebtoken")
const User = require("../models/user")

const isAuth = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization
		if (!authHeader) {
			const erro = new Error("Authorization credentials is not attached")
			erro.status = 403
			throw erro
		}
		const token = req.headers.authorization.split(" ")[1]
		if (!token) {
			const error = new Error("Authorization credentials not attached")
			error.status = 403
			throw error
		}
		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		if (!decoded) {
			const error = new Error("Unable to verify authentication  credntials")
			error.status = 403
			throw error
		} 
		// console.log(decoded)
		const user = await User.findById(decoded.user._id)
		if (!user) {
			const error = new Error("No user found with this credentials")
			error.status = 404
			throw error
		}
		req.user = user
		next()
	} catch (error) {
		if (!error.status) {
			error.status = 500
		}
		next(error)
	}
}

module.exports = isAuth
