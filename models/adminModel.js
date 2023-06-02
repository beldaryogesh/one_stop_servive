const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name : {
        type : String,
        require : true
    },
    number : {
        type : Number,
        require : true
    },
    email : {
        type :String,
        require : true
    },
    password : {
        type : String,
        require : true
    },
    address: {
        street: {
            type: String,
            required: true,
            trim:true
        },
        city: {
            type: String,
            required: true,
            trim:true
        },
        pincode: {
            type: Number,
            required: true,
            trim:true
        },
    
    },
    userType :{
        type : String,
        default : "admin"
    }
})

module.exports = mongoose.model("admin", adminSchema)