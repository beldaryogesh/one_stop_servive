const mongoose = require("mongoose");
const ObjectId = [mongoose.Schema.Types.ObjectId]


const serviceSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        trim : true
    },
    sellerName:{
        type : String,
        trim : true
    },
    serviceName :{
        type : String,
        require : true,
        enum : ["Appliance Repairs", "House Painters", "Cleaning", "Pest Control services", "Home Repairs", "Any Other Service"],
        trim : true
    },
    description : {
        type : String,
        require : true,
        trim : true
    },
    serviceImage: {
        type: String,
        trim: true
    },
    number : {
        type : Number,
        require : true,
        trim : true
    },
    isDeleted: { 
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("Service", serviceSchema)









