const User = require("../models/user");
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
    // Check if name was entered
    // if (!name) {
    //   return res.json({
    //     error: "name is required",
    //   });
    // }

    //Check mail
    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({
        error: "Email is already taken",
      });
    }

    //Check if password is good
    // if (!password || password.length < 6) {
    //   return res.json({
    //     error: "Password is required and should be 6 characters long",
    //   });
    // }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
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
  loginUser,
  verifyUser,
  // getUser,
};
