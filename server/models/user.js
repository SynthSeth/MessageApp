const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: String,
    email: String,
    password: String,
    profileImageUrl: String,
    messages: [{ type: mongoose.Schema.Types.ObjectId, required: true }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
