// NODE_ENV production setup bhulvu nahi

/////////////////////////////////////////////////////////////////////
Protected Route Example (Testing ke liye)
const { protect } = require("./middlewares/authMiddleware");

app.get("/api/profile", protect, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});



// // API ENDPOINTS CREATED // //

/api/auth/login
/api/auth/register

