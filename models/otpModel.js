const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      require: true,
    },
    otp: {
      type: String,
      require: true,
    },
  },
  { timestamps: true },
  { versionKey: false }
);

module.exports = mongoose.model("Otp", otpSchema);
