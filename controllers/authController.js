// const User = require("../models/user");
const Candidate = require("../models/candidate");
const Company = require("../models/company");
const JObModel = require("../models/jobModel");
// const ApplicationModel = require("../models/Application");
const jwt = require("jsonwebtoken");

// import {hashPassword, comparePassword} from '../helpers/auth'
const { hashPassword, comparePassword } = require("../helpers/auth");

//Nodemailer
const nodemailer = require("nodemailer");

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

const updateCandiadte = async (req, res) => {
  try {
    const { email, useremail, username, userphone } = req.body;

    const findUser = await Candidate.findOneAndUpdate(
      { "candidate.Useremail": email },
      {
        $set: {
          "candidate.Useremail": useremail,
          "candidate.Username": username,
          "candidate.Userphone": userphone,
        },
      },
      { new: true }
    );
    res.json({ message: "User Updated successfully!", findUser });
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

const getSearchedJobs = async (req, res) => {
  try {
    const { query } = req.query;
    const findJobs = await JObModel.find({
      $or: [
        { Position: { $regex: query, $options: "i" } }, // Searching by job title (case-insensitive)
        { Desc: { $regex: query, $options: "i" } }, // Searching by job description (case-insensitive)
        { Category: { $regex: query, $options: "i" } },
        { Skills: { $regex: query, $options: "i" } },
        { CompanyName: { $regex: query, $options: "i" } },
      ],
    });
    if (findJobs.length === 0) {
      res.json({ message: "No jobs Found!!" });
    }
    return res.json({ findJobs });
    // console.log(query);
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
      jobname,
      Userimage,
      downloadURL,
      fb,
      linkedin,
      github,
      portfolio,
      experience,
      cover,
      jobid,
    } = req.body;

    // Now for the job vacancy Array
    const findJobVacancy = await JObModel.findOne({ _id: jobid });
    // console.log(findJobVacancy.CompanyName);

    // Finding company and desireed job
    const findDesiredCompany = await Company.findOne({
      "company.name": findJobVacancy.CompanyName,
      "job._id": findJobVacancy.Job_id,
    });

    // const finduser = await Candidate.findOne({ "candidate.Useremail": email });

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
      jobname: jobname,
      Userimage: Userimage,
      resume: downloadURL,
      fb: fb,
      linkedin: linkedin,
      github: github,
      portfolio: portfolio,
      experience: experience,
      cover: cover,
      status: "pending",
    };

    findDesiredCompany.job[jobIndex].Applications.push(newApplication);
    const final = await findDesiredCompany.save();

    findJobVacancy.Application.push(newApplication);
    const final1 = await findJobVacancy.save();

    // finduser.Applications.push(newApplication);
    // const final2 = await finduser.save();

    // console.log(findJobVacancy);
    // console.log("Finally!")
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: "thur.thunder.3@gmail.com",
        pass: process.env.PASS,
      },
    });

    // console.log("done upto here");

    const mailOptions = {
      from: "thur.thunder.3@gmail.com",
      to: email,
      subject: `Application for ${jobname} `,
      html: `<p> Dear ${Cname},<p>Thank you for your interest! We wanted to let you know that your application for Front-End Software Engineer is sent to desired company.</p> <p>The company will review your application and will be in touch if your qualifications matches their needs for the role.</p> <br> <p>Best Regards,</p> <p>JobBoard</p>`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.json("Something went wrong!");
      } else {
        return res.json("Email sent Successfully!");
      }
    });

    return res.json({ message: "Application Posted Successfully!" });
  } catch (error) {
    console.log(error);
  }
};

const changeStatus = async (req, res) => {
  const { name, email, appId, newStatus, UserEmail } = req.body;
  try {
    // Find the company document containing the application
    const company = await Company.findOne({
      "job.Applications._id": appId,
    });

    if (!company) {
      return res.json({ message: "No Company Found!" });
    }

    // Find the job that contains the application
    let foundApplication = null;
    for (const job of company.job) {
      const application = job.Applications.id(appId);
      console.log(application);
      if (application) {
        foundApplication = application;
        application.status = newStatus;
        break;
      }
    }

    if (!foundApplication) {
      return res.json({ message: "Application not found in any job" });
    }

    // Save the updated company document
    await company.save();
    console.log(foundApplication);

    // res.json({ company });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: "thur.thunder.3@gmail.com",
        pass: process.env.PASS,
      },
    });

    // console.log("done upto here");

    const mailOptions = {
      from: "thur.thunder.3@gmail.com",
      to: UserEmail,
      subject: `Application Status for ${foundApplication.jobname} at ${name} from JobBoard`,
      html: `<p> Dear ${
        foundApplication.name
      },<p> I hope this message finds you well. I am writing to you on behalf of ${name} regarding your recent application for the ${
        foundApplication.jobname
      } submitted through JobBoard.</p> <p>${
        newStatus === "accepted"
          ? "We are pleased to inform you that your application has been successful. Your skills and experiences align well with what we are looking for in a candidate. We believe you would be a valuable addition to our team."
          : "After careful consideration, we regret to inform you that we have decided not to move forward with your application at this time. The decision was not easy due to the high quality of applications we received for this position."
      }</p> <p>Please remember that this does not reflect on your abilities or qualifications. We encourage you to apply for any future positions at ${name} that you feel you are qualified for.</p> <br> <p>Thank you for your interest in ${name} and for taking the time to apply through JobBoard. We appreciate your patience throughout the application process.</p> <br> <p>Best Regards,</p> <p>${name}</p><p>${email}</p> `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.json("Something went wrong!");
      } else {
        return res.json({
          message: "Email sent Successfully!",
          foundApplication: foundApplication,
        });
      }
    });

    // return res.json({ message: `Application is ${newStatus}!` });
    // return res.json({ company });
  } catch (error) {
    return res.json({ message: "Something went wrong" });
  }
};

const getAllCompany = async (req, res) => {
  try {
    const allCompanies = await Company.find();

    res.json({ allCompanies });
  } catch (error) {
    console.log(error);
  }
};

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
  changeStatus,
  getSearchedJobs,
  updateCandiadte,
  getAllCompany,
};
