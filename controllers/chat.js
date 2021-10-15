const Chat = require("../models/chat")
const User = require("../models/user")
const io = require("../utils/socket")

exports.create = async (data, socket) => {
    try {
        let roomId;
        // console.log("reached")
        const receiver = await User.findOne({ phone: data.to })
        if (!receiver) {
            throw new Error("Invalid receiver object")
        }

        // const roomExist = await Chat.findOne({ participants: { user: receiver._id } && { user: socket.user._id } })
        const roomExist = await Chat.findOne({ participants: { $all: [{ user: socket.user }, { user: receiver }] } })
        if (data.chatRoomId) {
            roomId = data.chatRoomId
            // console.log("reached if")
        } else if (roomExist) {
            roomId = roomExist._id
            // console.log("reached else if")
        } else {
            // console.log("reached else")
            const newChat = await new Chat({
                createdBy: socket.user
            })
            newChat.participants.push({ user: socket.user._id })
            newChat.participants.push({ user: receiver._id })
            await newChat.save()
            roomId = newChat._id
        }
        console.log(roomId)
        socket.join(roomId)

        io.getIO().emit("new_message", { roomId: roomId, receiver: receiver.phone, message: data.message, action: "JoinAndRecieve" })
        io.getIO().to(roomId).emit("actuallymessage", data)

        // socket.to(roomId).emit('message', {roomId: roomId, reciever: receiver.phone, message: data.message, action: "JoinAndRecieve"})
    } catch (err) {
        console.log(err)
    }
}

exports.join = async (data, socket) => {
    console.log('Joining...')
    socket.join(data.roomId)
    io.getIO().to(data.roomId).emit("actuallymessage", data)
    // socket.to(data.roomId).emit("actuallymessage", data)
}