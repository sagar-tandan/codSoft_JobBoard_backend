const mongoose = require("mongoose");
const { Schema } = mongoose;

const jobSchema = new Schema({
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

const JObModel = mongoose.model("JobVacancy", jobSchema);

module.exports = JObModel;
