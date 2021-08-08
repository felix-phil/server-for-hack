const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")

const authRoutes = require("./routes/auth")
const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "images")));


app.use('/auth', authRoutes)

app.use((err, req, res, next)=>{
	const status=err.status || 500
	const message = err.message || "Internal Server Error occurred!"
	const data = err.data || []
	res.status(status).json({message, status})
});
const PORT = process.env.PORT || 3000
const mongoDB = process.env.MONGO_URL
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology:true}).then(con => {
app.listen(PORT, ()=>{
	console.log(`Server running on port ${PORT} 🏃`)
})}).catch(err=> console.log(err))
mongoose.set("useCreateIndex", true);
