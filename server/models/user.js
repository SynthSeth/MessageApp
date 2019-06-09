const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  username: String,
  email: String,
  password: String,
  profileImageUrl: String,
  createdAt: Date,
  messages: [{ id: mongoose.Schema.Types.ObjectId }]
});

module.exports = mongoose.model("User", userSchema);
