const mongoose = require('mongoose')
const password = "aaaaaaa"

const mongodb =  mongoose.connect('mongodb+srv://ashiqachu46:yYMmY58OURk5bnx1@cluster0.suuvm4f.mongodb.net/cozastore')
.then(() => {
    console.log("connected")
}).catch((error) => {
    console.log(error);
})




module.exports = {
    password,
    mongodb
}