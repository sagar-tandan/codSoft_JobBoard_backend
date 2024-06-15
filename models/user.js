const mongoose = require("mongoose");
const { Schema } = mongoose;

const companySchema = new Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  image: String,
  selectedCity: String,
  selectedCountry: String,
  phone: Number,
});

// Define User schema
const userSchema = new Schema({
  company: companySchema, // Embed Company schema
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
