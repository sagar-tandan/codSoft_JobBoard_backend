const mongoose = require("mongoose");
const { Schema } = mongoose;

const userApplication = new Schema({
  name: String,
  email: String,
  phone: Number,
  location: String,
  // resume: "",
  fb: String,
  linkedin: String,
  github: String,
  portfolio: String,
  experience: String,
  cover: String,
});

const ApplicationModel = mongoose.model("UsersApplication", userApplication);

module.exports = ApplicationModel;
