// const User = require("../models/user");
const Candidate = require("../models/candidate");
const Company = require("../models/company");
const JObModel = require("../models/jobModel");
const jwt = require("jsonwebtoken");
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
  const {
    id,
    cName,
    cLoc,
    cPhone,
    position,
    des,
    resp,
    requ,
    benefits,
    jobtype,
    category,
    skills,
    salary,
    experience,
    gender,
    qual,
    level,
  } = req.body;
  const findDesiredCompany = await Company.findOne({ "company._id": id });
  const newJob = {
    CompanyName: cName,
    CompanyLocation: cLoc,
    CompanyPhone: cPhone,
    Position: position,
    Desc: des,
    Responsibility: resp,
    Requirement: requ,
    Benefits: benefits,
    Type: jobtype,
    Category: category,
    Skills: skills,
    Salary: salary,
    Experience: experience,
    Gender: gender,
    Qualification: qual,
    Level: level,
  };
  findDesiredCompany.job.push(newJob);
  const final = await findDesiredCompany.save();
  const jobvacancy = await JObModel.create(newJob);

  return res.json({ final, jobvacancy });
};

module.exports = {
  test,
  registerUser,
  registerUser1,
  loginUser,
  verifyUser,
  uploadJob,
};
