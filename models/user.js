const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImageUrl: { type: String },
    messages: [{ type: mongoose.Schema.Types.ObjectId, required: true }]
  },
  { timestamps: true }
);

userSchema.pre("save", async function() {
  try {
    const SALT_ROUNDS = 10;
    const hashedPassword = await bcrypt.hash(this.password, SALT_ROUNDS);
    this.password = hashedPassword;
  } catch (err) {
    throw err;
  }
});

module.exports = mongoose.model("User", userSchema);
