const mongoose = require('mongoose')
const password = "aaaaaaa"

const mongodb =  mongoose.connect('mongodb+srv://ashiqachu46:yYMmY58OURk5bnx1@cluster0.suuvm4f.mongodb.net/cozastore')
.then(() => {
    console.log("connected")
}).catch((error) => {
    console.log(error);
})

const accountSid = "AC878fb142754211e8ca8725e740b14636"
const authToken = 'b83b7e7b60309e84230a49f8f33590ef';
const verifySid = "VAe6f1d843c0f443981c86d3811cc2b68f";




module.exports = {
    password,
    mongodb,
    verifySid,
    authToken,
    accountSid
}