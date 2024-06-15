// const User = require("../models/user");
const Candidate = require("../models/candidate");
const Company = require("../models/company");
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
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: "No user found!!",
      });
    }

    //check if password match
    const match = await comparePassword(password, user.password);

    if (match) {
      const token = jwt.sign(
        { email: user.email, id: user._id, name: user.name },
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
      return res.json({ message: "Login Successful", user: user, token });
    }

    if (!match) {
      return res.json({
        error: "Password doesn't match",
      });
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

const verifyUser = (req, res) => {
  // const token = req.cookies.token;
  // if (!token) {
  //   res.json({ error: "No token found" });
  // }

  // jwt.verify(String(token), process.env.JWT_SECRET, async (err, data) => {
  //   if (err) {
  //     return res.json({ error: "Invalid Token" });
  //   }
  //   const user = await User.findById(data.id);
  //   if (user){
  //     return res.json({ user })
  //   }else{
  //     return res.json({error: "User not found!"})
  //   }

  // });
  // console.log("Cookies:", req.cookies.token);
  // const cookie = req.cookies;

  const token = req.cookies.token;

  if (!token) {
    return res.json({ error: "token not found" });
  }
  jwt.verify(String(token), process.env.JWT_SECRET, async (err, data) => {
    if (err) {
      return res.json({ error: "Invalid Token" });
    } else {
      // console.log(data.id)
      const user = await User.findById(data.id);
      if (user) return res.json({ status: true, user: user.name });
      else return res.json({ error: "User not found!" });
    }
  });

  // if (cookies) {
  //   const token = cookies.split("=")[1];
  //   if (!token) {
  //     res.json({ error: "No token found" });
  //   }
  //   jwt.verify(String(token), process.env.JWT_SECRET, (err, user) => {
  //     if (err) {
  //       return res.json({ error: "Invalid Token" });
  //     }
  //     // console.log(user.id);
  //     req.id = user.id;
  //   });
  //   next();
  // }
};

// const getUser = async (req, res, next) => {
//   const userId = req.id;
//   let user;
//   try {
//     user = await User.findById(userId, "-password");
//   } catch (error) {
//     return new Error(err);
//   }
//   if (!user) {
//     return res.json({ message: "user not found!!" });
//   }
//   return res.json({ user });
// };

module.exports = {
  test,
  registerUser,
  registerUser1,
  loginUser,
  verifyUser,
  // getUser,
};
