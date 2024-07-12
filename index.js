// const express = require("express");
// const dotenv = require("dotenv").config();
// const cors = require("cors");
// const mongoose = require("mongoose");
// const cookieParser = require("cookie-parser");

// const app = express();
// const router = require("./routes/authRoutes");

// mongoose
//   .connect(process.env.MONGO_URL)
//   .then(() => console.log("DB Connected"))
//   .catch((err) => console.log("DB not Connected", err));

// //middleware
// app.use(express.json());
// app.use(cookieParser());
// app.use(express.urlencoded({ extended: false }));

// app.use("/", router);

// const port = 8000;
// app.listen(port, () => console.log(`Server is running on port ${port}`));

const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const router = require("./routes/authRoutes");

const app = express();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected"))
  .catch((err) => {
    console.error("DB not Connected", err);
    process.exit(1); // Exit process if DB connection fails
  });

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

app.use("/", router);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));

// Handle uncaught exceptions and unhandled promise rejections
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});
