const express = require("express");
const router = express.Router();
const cors = require("cors");

// // for storing files
// const multer = require("multer");
// const bodyParser = require("body-parser");
// const path = require("path");

const {
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
} = require("../controllers/authController");

//middleWare
router.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173", // Fix: Match the correct protocol and port
  })
);

// // Configure Multer for file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage: storage });

// router.get('/', test);
router.post("/register", registerUser);
router.post("/registerUser", registerUser1);
router.post("/login", loginUser, verifyUser);
router.post("/", verifyUser);
router.post("/uploadjob", uploadJob);
router.get("/getCompanyJobs", getCompanyJobs);
router.delete("/deleteJobs", deleteJob);
router.get("/getAllJobs", getAllJobs);
router.post("/submitApplication", submitApplication);
router.post("/changeStatus", changeStatus);

module.exports = router;
