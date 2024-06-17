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
  type: String,
});

const job = new Schema({
  CompanyName: String,
  CompanyLocation: String,
  CompanyPhone: Number,
  Position: String,
  Desc: String,
  Responsibility: String,
  Requirement: String,
  Benefits: String,
  Type: String,
  Category: String,
  Skills: String,
  Salary: Number,
  Experience: Number,
  Gender: String,
  Qualification: String,
  Level: String,
});

// Define User schema
const userCompanySchema = new Schema({
  company: companySchema,
  job: [job],
});

const UserCompanyModel = mongoose.model("Company", userCompanySchema);

module.exports = UserCompanyModel;
