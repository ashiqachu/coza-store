const mongoose = require('mongoose')

const adrress = mongoose.Schema({

    userId: {
        type:mongoose.Types.ObjectId,
        require:true
    },
    firstName:{
        type:String,
        require:true
    },
    lastName:{ 
        type:String,
        require:true
    } ,
    country:{ 
        type:String,
        require:true
    } ,
    adrress:{ 
        type:String,
        require:true
    } ,
    mobile:{ 
        type:Number,
        require:true
    } ,
    PinCode:{ 
        type:Number,
        require:true
    } 
})


module.exports = mongoose.model("Adresse",adrress)