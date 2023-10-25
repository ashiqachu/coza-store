const mongoose = require('mongoose')

const user = mongoose.Schema({
    username:{
        type:"string",
        require:true    
    },
    email:{
        type:"string",
        require:true
    },
    password:{
        type:"string",
        require:true
    },
    mobile:{
        type:"string",
        require:true
    },
    cart: {
        type:Array,

    },
    wallet : {
        type : Number
    },
    is_Listed:{
        type:Boolean,
        require:true
    }
   

})

const User = mongoose.model('User',user)

module.exports = User