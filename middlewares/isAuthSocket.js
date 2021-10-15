const jwt = require("jsonwebtoken")
const User = require("../models/user")

const isAuthSocket = async (socket, next) => {
    try {
        if (socket.handshake.query && socket.handshake.query.token) {
            const decoded = await jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET)
            if (!decoded) {
                const error = new Error("Authentication Error")
                throw error
            }
            const user = await User.findById(decoded.user._id)
            if (!user) {
                const error = new Error("Authentication Error")
                throw error
            }
            socket.user = user
            next()
        }else{
            throw new Error("Authentication details not provided")
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
}
module.exports = isAuthSocket