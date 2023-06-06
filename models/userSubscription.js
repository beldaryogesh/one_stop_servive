const mongoose = require('mongoose');
const objectId =  mongoose.Schema.Types.ObjectId;

const userSubscription = new mongoose.Schema({
    userId : {
        type : objectId,
        ref : "User"
    },
    subscriptionId : {
        type : objectId,
        ref : "Subscription"
    }

}, {timestamps : true})


module.exports = mongoose.model("TimeSubscription", userSubscription)