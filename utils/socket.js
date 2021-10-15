let io;

exports.init = (httpServer) => {
    io = require("socket.io")(httpServer)
    return io
}
exports.getIO = () => {
    if(!io){
        throw new Error("No socket have been initialized!")
    }
    return io
}
