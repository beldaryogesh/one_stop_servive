const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema(
  {
    userType: {
      type: String,
      default: "customer",
      enum: ["customer", "admin", "seller"],
    },
    name: {
      type: String,
      require: true,
      trim: true,
    },
    number: {
      type: Number,
      require: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      trim: true,
    },
    password: {
      type: String,
      require: true,
      trim: true,
    },
    address: {
      street: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
      pincode: {
        type: Number,
        required: true,
        trim: true,
      },
    },
    otp: {
      type: ObjectId,
      ref: "Otp",
    },
    userStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "verified",
    },
    userServices: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Service",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    expiryDate: {
      type: Date,
    },
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
    },
  },
  { timestamps: true },
  { versionKey: false }
);

module.exports = mongoose.model("User", userSchema);
