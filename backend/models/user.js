const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
//mongoose-unique-validator can be used as  plugin in schema.Its a featture proovided by moongoose
//mongoose-unique-validator is to check that we dont store similar data in email as  unique: true cant check it
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
