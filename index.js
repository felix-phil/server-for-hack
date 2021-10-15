const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")

const authRoutes = require("./routes/auth")
const chatRoutes = require("./routes/chat")
const chatSocketRoutes = require("./websocket-routes/chat")
const isAuthWebSocket = require("./middlewares/isAuthSocket")

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));


app.use('/auth', authRoutes)
app.use("/chat", chatRoutes)

app.use((err, req, res, next) => {
	const status = err.status || 500
	let message = err.message || "Internal Server Error occurred!"
	const regex = new RegExp("getaddrinfo", "i")
	if (regex.test(message)) {
		message = "Internal Server Error"
	}
	const data = err.data || []
	res.status(status).json({ message, status, data })
});
const PORT = process.env.PORT || 3000
const mongoDB = process.env.MONGO_URL
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(con => {
	const httpServer = app.listen(PORT, () => {
		console.log(`Server for HackChat running on port ${PORT} 🏃`)
	})
	const io = require('./utils/socket').init(httpServer)
	io.use(isAuthWebSocket)
	io.on('connection', socket => {
		const connectedUser = socket.user
		console.log(`Client connected: ${connectedUser.phone}`)
		socket.on("chat", data => {
			// console.log(data)
			chatSocketRoutes(data, socket)
		})
		socket.on('disconnect', socket => {
			console.log(`Client disconnected: ${connectedUser.phone}`)
		})
	})
	io.on('error', error => {
		console.log(error)
	})
}).catch(err => console.log(err))
mongoose.set("useCreateIndex", true);
