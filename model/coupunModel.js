const mongoose = require ('mongoose')

const coupunSchema = mongoose.Schema({
    code : {
        type : String,
        require : true
    },
    start : {
        type : Date,
        require : true
    },
    expire : {
        type : Date,
        require : true
    },
   
    discount : {
        type : Number,
        require : true
    },
 
    is_Listed : {
        type : Boolean, 
        require : true
    }
})

module.exports = mongoose.model('coupun',coupunSchema) 