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
});

// Define User schema
const userCandidateSchema = new Schema({
  candidate: candidateSchema,
});

const UserCandidateModel = mongoose.model("Candidate", userCandidateSchema);

module.exports = UserCandidateModel;
