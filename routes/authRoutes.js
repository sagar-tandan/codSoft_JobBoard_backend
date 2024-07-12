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
  getSearchedJobs,
  updateCandiadte,
  getAllCompany,
} = require("../controllers/authController");

//middleWare
router.use(
  cors({
    credentials: true,
    origin: "*", // Fix: Match the correct protocol and port
  })
);



router.get('/', test);
// router.post("/register", registerUser);
// router.post("/registerUser", registerUser1);
// router.post("/login", loginUser, verifyUser);
// router.post("/", verifyUser);
// router.post("/uploadjob", uploadJob);
// router.get("/getCompanyJobs", getCompanyJobs);
// router.delete("/deleteJobs", deleteJob);
// router.get("/getAllJobs", getAllJobs);
// router.post("/submitApplication", submitApplication);
// router.post("/changeStatus", changeStatus);
// router.get("/getSearchedJobs", getSearchedJobs);
// router.post("/updateCandiadte", updateCandiadte);
// router.get("/getAllCompany", getAllCompany);

module.exports = router;
