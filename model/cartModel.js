const mongoose = require('mongoose')

cartSchema = mongoose.Schema({
    product : {
    type : mongoose.Types.ObjectId,
    require : true
    },
    count : {
        type : Number,
        require : true
    },
    total : {
        type : Number,
        require : true
    }
   
    
})

module.exports = mongoose.model('cart',cartSchema)