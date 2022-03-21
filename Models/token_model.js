const mongoose = require('mongoose')

const tokenschema = mongoose.Schema({
    reg_no:{
        type:String,
        required:true
    },
    refresh_token:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model("tokens", tokenschema);