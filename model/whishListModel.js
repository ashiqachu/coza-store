const mongoose = require('mongoose')

const whishList = mongoose.Schema({
    user : {
        type : mongoose.Types.ObjectId,
        require : true
    },
    product:{
        type : Array,
        require : true
    }
  
})

module.exports = mongoose.model('whishList',whishList) 