const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: String,
    email: String,
    password: String,
    profileImageUrl: String,
    messages: [{ _id: mongoose.Schema.Types.ObjectId }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
