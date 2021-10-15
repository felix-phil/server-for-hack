const chatController = require("../controllers/chat")

const socketRouter = (data, socket) => {
    const { action } = data
    switch(action){
        case 'create':
            chatController.create(data, socket);
            break;
        case 'join':
            chatController.join(data, socket);
            break;
    }
}
module.exports = socketRouter