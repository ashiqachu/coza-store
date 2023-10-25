const mongoose = require('mongoose')

bannerSchema = mongoose.Schema({
    banner : {
    type : String,
    require : true
    },
    banner_Logo : {
        type : String,
        require : true
    },
    is_Listed : {
        type : Boolean,
        require : true
    }
    
})

module.exports = mongoose.model('banner',bannerSchema)