const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, required: true },
    content: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
