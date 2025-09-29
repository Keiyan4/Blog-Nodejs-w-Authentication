const express = require("express");
const passportConfig = require("../authentication/passport");
const blogController = require("../controllers/blogController");
require("dotenv").config();

const router = express.Router();

router.get("/blogs/login", blogController.blogs_login_get);

router.get("/blogs/register", blogController.blogs_register_get);

router.get(
  "/blogs",
  passportConfig.Authenticated,
  blogController.blogs_allBlogs_get
);

router.get("/blogs/create", blogController.blogs_create_get);

router.post("/blogs", blogController.blogs_create_post);

router.get("/blogs/logout", blogController.blogs_logout_get);

router.get(
  "/blogs/:id",
  passportConfig.Authenticated,
  blogController.blogs_details_get
);

router.delete("/blogs/:id", blogController.blogs_delete);

module.exports = router;
