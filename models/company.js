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

const userApplication = new Schema({
  name: String,
  email: String,
  phone: Number,
  location: String,
  jobname: String,
  Userimage: String,
  resume: String,
  fb: String,
  linkedin: String,
  github: String,
  portfolio: String,
  experience: String,
  cover: String,
  status: String,
});

const job = new Schema({
  CompanyName: String,
  CompanyLocation: String,
  CompanyPhone: Number,
  Position: String,
  Desc: String,
  Responsibility: Array,
  Requirement: Array,
  Benefits: Array,
  Type: String,
  Category: String,
  Skills: String,
  Salary: String,
  Experience: Number,
  Gender: String,
  Qualification: String,
  Level: String,
  PublishedDate: String,
  ExpiryDate: String,
  Applications: [userApplication],
});

// Define User schema
const userCompanySchema = new Schema({
  company: companySchema,
  job: [job],
  // applications: [userApplication],
});

const UserCompanyModel = mongoose.model("Company", userCompanySchema);

module.exports = UserCompanyModel;
