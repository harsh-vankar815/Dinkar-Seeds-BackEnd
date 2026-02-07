require("dotenv").config();
require("./config/passport");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes")
const galleryRoutes = require("./routes/galleryRoutes")
const chatRoutes = require("./routes/chatRoutes")
const { errorHandler } = require("./middlewares/errorMiddleware");
const productRoutes = require("./routes/productRoutes")
const path = require('path')
const app = express();
const PORT = process.env.PORT || 5000;

// serving static folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // frontend URL
    credentials: true, // cookies allow
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
})) // adds all default security headers
// Log requests in 'dev' format
app.use(morgan("dev"));

app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/profile", userRoutes)
app.use("/api/products", productRoutes)
app.use("/api/gallery", galleryRoutes)
app.use("/api/chat", chatRoutes)

// error middleware (last me)
app.use(errorHandler);
// Database connection
connectDB();

app.get("/", (req, res) => {
  res.send("API is running...");
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
