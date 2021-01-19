const mongoose = require("mongoose");

const userShema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  refreshToken: {
    type: String,
    default: "empty",
    required: true,
  },
});

module.exports = mongoose.model("user", userShema);
