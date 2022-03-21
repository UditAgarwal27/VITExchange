const mongoose = require('mongoose');

const internal_error_schema = new mongoose.Schema({
    event:{
        type:String,
        required:true
    },
    error:{
        type:String,
        require:true
    }
})

module.exports = mongoose.model("internal_errors", internal_error_schema);