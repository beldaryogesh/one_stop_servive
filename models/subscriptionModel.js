const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const subscriptionSchema = new mongoose.Schema({
  subscriptionName : {
    type : String,
    require : true,
    trim : true
  },
  sellerId :{
        type : ObjectId,
        ref : 'User',
        trim : true
   },
   description : {
    type : string ,
    require : true,
    trim : true
   },
   subscriptionPrice : {
    type : Number,
    require : true,
    trim : true
   },
   startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired'],
    default: 'active'
  }   
})

module.exports = mongoose.model('Subscription', subscriptionSchema )

