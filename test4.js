const User = require("./models/user")

const getu = async () => {
User.find().then(user =>{
console.log(user)
}).catch(err => {
console.log(err)
})
}
getu()
