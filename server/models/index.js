const mongoose = require("mongoose");
const UserModel = require("./user");
const MessageModel = require("./message");

mongoose.Promise = Promise;
mongoose.connect(process.env.DB_URL, {useNewUrlParser: true});

module.exports = mongoose;