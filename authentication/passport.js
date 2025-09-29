const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const bcrypt = require("bcrypt");
const db = require("../config/db");

// Local Strategy //
passport.use(
  "local",
  new LocalStrategy(async (username, password, cb) => {
    try {
      const { rows } = await db.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );
      if (rows.length === 0)
        return cb(null, false, { message: "No user found" });

      const user = rows[0];
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return cb(null, false, { message: "Incorrect password" });

      return cb(null, user);
    } catch (err) {
      return cb(err);
    }
  })
);

// Google Strategy //
passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/blogs",
    },
    async (accessToken, refreshToken, profile, cb) => {
      const username = profile.email || `google_${profile.id}`;
      try {
        const result = await db.query(
          "SELECT * FROM users WHERE username = $1",
          [username]
        );
        if (result.rows.length === 0) {
          const newUser = await db.query(
            "INSERT INTO users (username, password, refreshtoken) VALUES ($1, $2, $3) RETURNING *",
            [username, "null", ""]
          );
          return cb(null, newUser.rows[0]);
        } else {
          return cb(null, result.rows[0]);
        }
      } catch (err) {
        return cb(err);
      }
    }
  )
);

//  Session Handling //
passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  try {
    const { rows } = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    if (rows.length === 0) return cb(null, false);
    return cb(null, rows[0]);
  } catch (error) {
    cb(error);
  }
});

// Auth Middleware
function Authenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/blogs/login");
}

module.exports = { passport, Authenticated };
