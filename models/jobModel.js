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

const jobSchema = new Schema({
  CompanyName: String,
  CompanyLocation: String,
  CompanyPhone: Number,
  companyImage: String,
  copanyEmail: String,
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
  Job_id: String,
  Application: [userApplication],
});

const JObModel = mongoose.model("JobVacancy", jobSchema);

module.exports = JObModel;
