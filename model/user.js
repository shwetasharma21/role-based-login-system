const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  pass: { type: String, required: true },
  role: { type: String, default: "user" },
});

module.exports = mongoose.model("User", UserSchema);
