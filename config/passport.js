const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
        // Checking ki kya user googleId ya email se already loggedin hai ki nahi
        let user = await User.findOne({
          $or: [{ googleId: profile.id }, { email }],
        });

        if (user) {
          // agr user pelathi j email ane password thi banelo voy to
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
        } else {
          // auto register new google user
          user = await User.create({
            firstName: profile.name.givenName,
            lastName: profile.name.familyName || "",
            email,
            image: profile.photos?.[0]?.value || "",
            googleId: profile.id,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);
