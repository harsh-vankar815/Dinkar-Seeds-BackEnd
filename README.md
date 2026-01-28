// NODE_ENV production setup bhulvu nahi

sameSite: "strict", // for development only
// sameSite: "None", // Required for cross-site (Render/Cloud)

On Render, ensure your backend has an SSL certificate (standard on Render) for secure: true cookies to work.


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
/api/auth/refresh-token
/api/auth/logout

// testing route authentication is working or not
/api/profile
/api/profile/me
/api/profile/update
