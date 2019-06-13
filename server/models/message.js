const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  content: { type: String, require: true },
  createdAt: { type: mongoose.Schema.Types.String , default: Date.now().toString() }
});

module.exports = mongoose.model("Message", messageSchema);
