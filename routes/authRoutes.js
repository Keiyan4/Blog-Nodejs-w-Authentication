const express = require("express");
const validateRegister = require("../authentication/validationController");
const passport = require("passport");
const router = express.Router();
const authController = require("../controllers/authController");
const passportConfig = require("../authentication/passport");

router.post(
  "/blogs/register",
  validateRegister,
  authController.auth_register_post
);

router.post("/blogs/login", authController.auth_login_post);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/auth/google/blogs",
  passport.authenticate("google", {
    successRedirect: "/blogs",
    failureRedirect: "/blogs/login",
  })
);

module.exports = router;
