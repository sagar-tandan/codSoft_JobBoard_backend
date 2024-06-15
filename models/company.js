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
const userCompanySchema = new Schema({
  company: companySchema,
});

const UserCompanyModel = mongoose.model("Company", userCompanySchema);

module.exports = UserCompanyModel;
