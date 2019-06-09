const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    author: { _id: mongoose.Schema.Types.ObjectId },
    content: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
