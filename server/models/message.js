const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  author: {id: mongoose.Schema.Types.ObjectId},
  content: String,
  createdAt: Date
});

module.exports = mongoose.model("Message", messageSchema);