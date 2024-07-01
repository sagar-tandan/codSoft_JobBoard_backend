const mongoose = require("mongoose");
const { Schema } = mongoose;

const candidateSchema = new Schema({
  Username: String,
  Useremail: {
    type: String,
    unique: true,
  },
  Userpassword: String,
  Userimage: String,
  UserselectedCity: String,
  UserselectedCountry: String,
  Userphone: Number,
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

// Define User schema
const userCandidateSchema = new Schema({
  candidate: candidateSchema,
});

const UserCandidateModel = mongoose.model("Candidate", userCandidateSchema);

module.exports = UserCandidateModel;
