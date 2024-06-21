// const User = require("../models/user");
const Candidate = require("../models/candidate");
const Company = require("../models/company");
const JObModel = require("../models/jobModel");
const ApplicationModel = require("../models/Application");
const jwt = require("jsonwebtoken");

// for storing files
const multer = require("multer");
const bodyParser = require("body-parser");
const path = require("path");
// import {hashPassword, comparePassword} from '../helpers/auth'
const { hashPassword, comparePassword } = require("../helpers/auth");

const test = (req, res) => {
  res.json("text is working");
};

const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      image,
      selectedCity,
      selectedCountry,
      phone,
    } = req.body;

    //Check mail
    const exist = await Company.findOne({ "company.email": email });
    if (exist) {
      return res.json({
        error: "Email is already taken",
      });
    }

    //Check name
    const exists = await Company.findOne({ "company.name": name });
    if (exists) {
      return res.json({
        error: "This Company name already exists!",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await Company.create({
      company: {
        name,
        email,
        password: hashedPassword,
        image,
        selectedCity,
        selectedCountry,
        phone,
        type: "company",
      },
    });

    return res.json(user);
  } catch (error) {
    console.log(error);
  }
};

//registration of Candidate
const registerUser1 = async (req, res) => {
  try {
    const {
      Username,
      Useremail,
      Userpassword,
      Userimage,
      UserselectedCity,
      UserselectedCountry,
      Userphone,
    } = req.body;

    //Check mail
    const exist = await Candidate.findOne({ "candidate.email": Useremail });
    if (exist) {
      return res.json({
        error: "Email is already taken",
      });
    }

    const hashedPassword = await hashPassword(Userpassword);

    // Create a new user with candidate details
    const candidate = await Candidate.create({
      candidate: {
        Username,
        Useremail,
        Userpassword: hashedPassword,
        Userimage,
        UserselectedCity,
        UserselectedCountry,
        Userphone,
        type: "candidate",
      },
    });

    return res.json(candidate);
  } catch (error) {
    console.log(error);
  }
};

//login Endpoint
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //Check mail
    const company = await Company.findOne({ "company.email": email });
    const candidate = await Candidate.findOne({
      "candidate.Useremail": email,
    });

    if (!company && !candidate) {
      return res.json({
        error: "No user found!!",
      });
    } else if (!company && candidate) {
      console.log(candidate);
      console.log(candidate.candidate.Userpassword);
      // check if password match
      const match = await comparePassword(
        password,
        candidate.candidate.Userpassword
      );
      if (match) {
        const token = jwt.sign(
          {
            email: candidate.candidate.Useremail,
            id: candidate.candidate._id,
            name: candidate.candidate.Username,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "3d",
          }
        );
        res.cookie("token", token),
          {
            withCredentials: true,
            httpOnly: false,
          };
        console.log(candidate.candidate);

        return res.json({
          message: "Login Successful",
          user: candidate.candidate,
          token,
        });
      }
      if (!match) {
        return res.json({
          error: "Password doesn't match",
        });
      }
      next();
    } else {
      console.log(company);
      // check if password match
      const match = await comparePassword(password, company.company.password);
      if (match) {
        const token = jwt.sign(
          {
            email: company.company.email,
            id: company.company._id,
            name: company.company.name,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "3d",
          }
        );
        res.cookie("token", token),
          {
            withCredentials: true,
            httpOnly: false,
          };
        console.log(company.company);

        return res.json({
          message: "Login Successful",
          user: company.company,
          token,
        });
      }
      if (!match) {
        return res.json({
          error: "Password doesn't match",
        });
      }
      next();
    }
  } catch (error) {
    console.log(error);
  }
};

const verifyUser = (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ error: "token not found" });
  }
  jwt.verify(String(token), process.env.JWT_SECRET, async (err, data) => {
    if (err) {
      return res.json({ error: "Invalid Token" });
    } else {
      console.log(data.id);

      //for Company
      const company1 = await Company.findOne({ "company._id": data.id });
      const candidate1 = await Candidate.findOne({ "candidate._id": data.id });
      if (!company1 && !candidate1) {
        return res.json({ error: "User not found!" });
      } else if (!company1 && candidate1) {
        return res.json({ status: true, user: candidate1.candidate });
      } else {
        return res.json({ status: true, user: company1.company });
      }
    }
  });
};

const uploadJob = async (req, res) => {
  try {
    const {
      id,
      cName,
      cLoc,
      cPhone,
      cImage,
      cEmail,
      position,
      des,
      responsibilities,
      requirements,
      benefits,
      jobtype,
      category,
      skills,
      salary,
      experience,
      gender,
      qual,
      level,
      published,
      end,
    } = req.body;
    const findDesiredCompany = await Company.findOne({ "company._id": id });
    const newJob = {
      CompanyName: cName,
      CompanyLocation: cLoc,
      CompanyPhone: cPhone,
      companyImage: cImage,
      copanyEmail: cEmail,
      Position: position,
      Desc: des,
      Responsibility: responsibilities,
      Requirement: requirements,
      Benefits: benefits,
      Type: jobtype,
      Category: category,
      Skills: skills,
      Salary: salary,
      Experience: experience,
      Gender: gender,
      Qualification: qual,
      Level: level,
      PublishedDate: published,
      ExpiryDate: end,
    };

    if (!findDesiredCompany) {
      return res.status(404).json({ error: "Company not found" });
    }

    findDesiredCompany.job.push(newJob);
    const final = await findDesiredCompany.save();
    const newJobId = final.job[final.job.length - 1]._id;
    newJob.Job_id = newJobId;
    const jobvacancy = await JObModel.create(newJob);

    return res.json({ message: "Job Posted Successfully!" });
    // console.log("done")
  } catch (error) {
    console.log(error);
  }
};

const getCompanyJobs = async (req, res) => {
  try {
    const { id } = req.query;
    const findCompanyById = await Company.findOne({ "company._id": id });
    if (!findCompanyById) {
      res.json({ error: "No Company Found!!" });
    }

    const findAllJobs = findCompanyById.job;
    if (!findAllJobs) {
      res.json({ error: "No Jobs Found!!" });
    }
    return res.json({ findAllJobs });
  } catch (error) {
    console.log(error);
  }
};

// const getCompanyAllApplications = async (req,res)=>{

//   try {
//     const { id } = req.query;
//     const findCompanyById = await Company.findOne({ "company._id": id });
//     if (!findCompanyById) {
//       res.json({ error: "No Company Found!!" });
//     }
//     const findAllJobs = findCompanyById.job;
//     if (!findAllJobs) {
//       res.json({ error: "No Jobs Found!!" });
//     }
//     return res.json({ findAllJobs });
//   } catch (error) {
//     console.log(error);
//   }

// }

// const getCompanyJobApplication = (req,res)=>{

// }

const deleteJob = async (req, res) => {
  try {
    const { cid, jid } = req.body;

    const jobToDelete = await Company.findOneAndUpdate(
      { "company._id": cid, "job._id": jid },
      { $pull: { job: { _id: jid } } },
      { new: true }
    );

    if (!jobToDelete) {
      return res
        .status(404)
        .json({ error: "Job not found in the specified company." });
    }

    const jobToDeleteFromJobs = await JObModel.findOneAndDelete({
      Job_id: jid,
    });

    console.log(jobToDeleteFromJobs);

    res.status(200).json({ message: "Job deleted successfully.", jobToDelete });
  } catch (error) {
    console.log(error);
  }
};

const getAllJobs = async (req, res) => {
  try {
    const findJobs = await JObModel.find();
    if (!findJobs) {
      res.json({ error: "No jobs Found!!" });
    }
    return res.json({ findJobs });
  } catch (error) {
    console.log(error);
  }
};

const submitApplication = async (req, res) => {
  try {
    const {
      Cname,
      email,
      phone,
      location,
      downloadURL,
      fb,
      linkedin,
      github,
      portfolio,
      experience,
      cover,
      jobid,
    } = req.body;

    // console.log(jobid);
    // Now for the job vacancy Array
    const findJobVacancy = await JObModel.findOne({ _id: jobid });
    // console.log(findJobVacancy.CompanyName);

    // Finding company and desireed job
    const findDesiredCompany = await Company.findOne({
      "company.name": findJobVacancy.CompanyName,
      "job._id": findJobVacancy.Job_id,
    });

    console.log(findDesiredCompany);

    if (!findDesiredCompany) {
      return res.status(404).json({ error: "Company not found" });
    }

    const jobIndex = findDesiredCompany.job.findIndex(
      (job) => job._id.toString() === findJobVacancy.Job_id
    );

    if (jobIndex === -1) {
      return res.json({ error: "Job not Found!" });
    }

    // console.log(jobIndex);

    const newApplication = {
      name: Cname,
      email: email,
      phone: phone,
      location: location,
      resume: downloadURL,
      fb: fb,
      linkedin: linkedin,
      github: github,
      portfolio: portfolio,
      experience: experience,
      cover: cover,
    };

    findDesiredCompany.job[jobIndex].Applications.push(newApplication);
    const final = await findDesiredCompany.save();

    findJobVacancy.Application.push(newApplication);
    const final1 = await findJobVacancy.save();

    // console.log(findJobVacancy);
    // console.log("Finally!")

    return res.json({ message: "Application Posted Successfully!" });
  } catch (error) {
    console.log(error);
  }
};

// // Updated submitApplication function
// const submitApplication = async (req, res) => {
//   try {
//     const {
//       id,
//       jid,
//       name,
//       email,
//       phone,
//       location,
//       fb,
//       linkedin,
//       github,
//       portfolio,
//       experience,
//       cover,
//     } = req.body;

//     const resume = req.file ? req.file.path : '';

//     // Finding company and desired job
//     const findDesiredCompany = await Company.findOne({
//       "company._id": id,
//       "job._id": jid,
//     });

//     if (!findDesiredCompany) {
//       return res.status(404).json({ error: "Company not found" });
//     }

//     const jobIndex = findDesiredCompany.job.findIndex(
//       (job) => job._id.toString() === jid
//     );

//     if (jobIndex === -1) {
//       return res.status(404).json({ error: "Job not found" });
//     }

//     // Now for the job vacancy Array
//     const findJobVacancy = await JObModel.findOne({ Job_id: jid });

//     const newApplication = {
//       name,
//       email,
//       phone,
//       location,
//       resume,
//       fb,
//       linkedin,
//       github,
//       portfolio,
//       experience,
//       cover,
//     };

//     findDesiredCompany.job[jobIndex].Applications.push(newApplication);
//     await findDesiredCompany.save();

//     findJobVacancy.Application.push(newApplication);
//     await findJobVacancy.save();

//     return res.json({ message: "Application posted successfully!" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "An error occurred while submitting the application" });
//   }
// };

module.exports = {
  test,
  registerUser,
  registerUser1,
  loginUser,
  verifyUser,
  uploadJob,
  getCompanyJobs,
  deleteJob,
  getAllJobs,
  submitApplication,
};
