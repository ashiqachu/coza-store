const mongoose = require('mongoose')


const orderSchema = mongoose.Schema({
    user : {
        type : mongoose.Types.ObjectId,
        require : true
    },
    productDetails : {
        type : Array,
        require : true
    },
    address : {
        type : Object,
        require : true
    },
    total : {
        type : Number,
        require : true
    },
 
   
})

module.exports = mongoose.model('order',orderSchema) 