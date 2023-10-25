const mongoose = require('mongoose')

const admin = mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    password:{ 
        type:Number,
        require:true
    } 
})

module.exports = mongoose.model('admindata',admin)
