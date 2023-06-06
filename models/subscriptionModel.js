const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const subscriptionSchema = new mongoose.Schema(
  {
    subscriptionName: {
      type: String,
      require: true,
      enum: ["quauterly plan", "half yearly plan", "annual plan"],
      trim: true,
    },
    userId: {
      type: ObjectId,
      ref: "User",
      trim: true,
    },
    description: {
      type: String,
      require: true,
      trim: true,
    },
    subscriptionPrice: {
      type: Number,
      require: true,
      trim: true,
    },
    userSubscription: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    subscriptionMonth: {
      type: Number,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);
// quauterly plan , half_yearly , annual
