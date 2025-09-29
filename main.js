const express = require("express");
const path = require("node:path");
const app = express();
require("dotenv").config();
const session = require("express-session");
const passport = require("passport");
const passportConfig = require("./authentication/passport");
const blogRoutes = require("./routes/blogRoutes");
const authRoutes = require("./routes/authRoutes");

app.use(
  session({
    secret: process.env.ACCESS_TOKEN_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", passportConfig.Authenticated, (req, res) => {
  res.redirect("/blogs");
});

app.get("/about", passportConfig.Authenticated, (req, res) => {
  res.render("about", { title: "About" });
});

app.use(authRoutes);
app.use(blogRoutes);

app.listen(3000);

/*const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token in DB
    await db_2.query("UPDATE users SET refreshtoken = $1 WHERE id = $2", [
      refreshToken,
      user.id,
    ]);

    // Send tokens
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true, // set true in production (HTTPS)
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ accessToken });*/

/*app.post("/token", async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) return res.sendStatus(401);

  try {
    const result = await db_2.query(
      "SELECT * FROM users WHERE refreshtoken = $1",
      [refreshToken]
    );

    const user = result.rows[0];

    jwt(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      const accessToken = generateAccessToken(user);
      res.json({ accessToken });
    });
  } catch (err) {
    console.error("Token refresh error:", err.message);
    res.status(500).send("Server error");
  }
});*/
