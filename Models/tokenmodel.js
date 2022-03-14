const mongoose = require('mongoose')

const tokenschema = mongoose.Schema({
    regno:{
        type:String,
        required:true
    },
    refreshtoken:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model("tokens", tokenschema);