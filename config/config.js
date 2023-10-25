const mongoose = require('mongoose')
const password = "aaaaaaa"

const mongodb =  mongoose.connect('mongodb://127.0.0.1:27017/project')
.then(() => {
    console.log("connected")
}).catch((error) => {
    console.log(error);
})




module.exports = {
    password,
    mongodb
}