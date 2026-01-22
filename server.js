require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const { errorHandler } = require("./middlewares/errorMiddleware");
const { protect } = require("./middlewares/authMiddleware");
const app = express();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(helmet()); // adds all default security headers
// Log requests in 'dev' format
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);

// error middleware (last me)
app.use(errorHandler);
// Database connection
connectDB();

app.get("/", (req, res) => {
  res.send("API is running...");
});

// yaha pe testing ho rahi hai ki user successfully profile page login hone ke baad access kar pa raha hai ya nahi
app.get("/api/profile", protect, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
