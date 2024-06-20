const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

// // for storing files
// const multer = require("multer");
// const bodyParser = require("body-parser");
// const path = require("path");

const app = express();
// app.use(bodyParser.json());
const router = require("./routes/authRoutes");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log("DB not Connected", err));

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use("/", router);

const port = 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
