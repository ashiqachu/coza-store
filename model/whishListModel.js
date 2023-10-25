const mongoose = require('mongoose')

const whishList = mongoose.Schema({
    product:{
        type : mongoose.Types.ObjectId,
        require : true
    }
  
})

module.exports = mongoose.model('whishList',whishList)