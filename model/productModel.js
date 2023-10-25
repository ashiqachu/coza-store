const mongoose = require ('mongoose')

const productSchema = mongoose.Schema({
    product_name : {
        type : String,
        require : true
    },
    price : {
        type : Number,
        require : true
    },
    offer_price : {
        type : Number,
        require : true
    },
   
    stock : {
        type : Number,
        require : true
    },
    description : {
        type : String,
        require : true
    },
    image : {
        type : Array,
        require : true
    },
    category : {
        type :mongoose.Types.ObjectId,
        require : true
    },
    is_Listed : {
        type : Boolean, 
        require : true
    }
})

module.exports = mongoose.model('Product',productSchema) 