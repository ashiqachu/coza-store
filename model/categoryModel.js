const mongoose = require ('mongoose')

categorySchema = mongoose.Schema({
    category_name : {
    type : String,
    require : true
    },
    category_logo : {
        type : String,
        require : true
    },
    category_discount : {
        type : Number
    },
    is_Listed : {
        type : Boolean,
        require : true
    }
    
})

module.exports = mongoose.model('Category',categorySchema)