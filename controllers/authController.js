const passportConfig = require("../authentication/passport");
const db_2 = require("../config/db_users");
const bcrypt = require("bcrypt");

const { validationResult } = require("express-validator");

const saltRounds = 10;

const auth_register_post = async (req, res) => {
  console.log("Incoming request body:", req.body);
  console.log("Before inserting user");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation errors:", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    const checkResult = await db_2.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (checkResult.rows.length > 0) {
      console.log("User already exists:", username);
      return res.redirect("/blogs/login");
    }

    const hash = await bcrypt.hash(password, saltRounds);
    console.log("Password hashed successfully");

    await db_2.query(
      "INSERT INTO users (username, password, refreshtoken) VALUES ($1, $2, $3) RETURNING *",
      [username, hash, ""]
    );
    console.log("After inserting user, redirecting");
    console.log("User registered successfully:", username);
    return res.redirect("/blogs/login");
  } catch (err) {
    console.error("Error registering user:", err.message);
    return res.status(500).send("Server error: " + err.message);
  }
};

const auth_login_post = passportConfig.passport.authenticate("local", {
  successRedirect: "/blogs",
  failureRedirect: "/blogs/login",
});

module.exports = {
  auth_register_post,
  auth_login_post,
};
