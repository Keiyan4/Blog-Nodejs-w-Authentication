const db = require("../config/db");
require("dotenv").config();

const blogs_login_get = (req, res) => {
  res.render("login");
};

const blogs_register_get = (req, res) => {
  res.render("register");
};

// Fetch all blogs
const blogs_allBlogs_get = async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT id, title, snippet
      FROM blogs
      ORDER BY id ASC
    `);

    res.render("index", { title: "All Blogs", blogs: rows });
  } catch (err) {
    console.error("Error fetching blogs:", err.message);
    res.status(500).send("Server Error: " + err.message);
  }
};

const blogs_create_get = (req, res) => {
  res.render("create", { title: "Create Blogs" });
};

const blogs_create_post = async (req, res) => {
  const { title, snippet, body } = req.body;
  try {
    const { rows } = await db.query(
      "INSERT INTO blogs (title, snippet, body) VALUES ($1, $2, $3) RETURNING *",
      [title, snippet, body]
    );
    console.log("Inserted blog:", rows[0]);
    res.redirect("/blogs");
  } catch (err) {
    console.error("Error inserting blog:", err.message);
    res.status(500).send("Server Error: " + err.message);
  }
};

const blogs_logout_get = (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
    res.redirect("/blogs/login");
  });
};

// Fetch single blog
const blogs_details_get = async (req, res) => {
  const id = req.params.id;
  try {
    const { rows } = await db.query(
      "SELECT id, title, body FROM blogs WHERE id = $1",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).send("Blog not found");
    }

    res.render("details", { blog: rows[0], title: "Blog Details" });
  } catch (err) {
    console.error("Error fetching blog details:", err.message);
    res.status(500).send("Server Error: " + err.message);
  }
};

const blogs_delete = async (req, res) => {
  const id = req.params.id;
  try {
    const { rows } = await db.query(
      "DELETE FROM blogs WHERE id = $1 RETURNING *",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).send("Blog not found");
    }

    res.json({ redirect: "/blogs" });
  } catch (err) {
    console.error("Error deleting blog:", err.message);
    res.status(500).send("Server Error: " + err.message);
  }
};

module.exports = {
  blogs_login_get,
  blogs_register_get,
  blogs_allBlogs_get,
  blogs_create_get,
  blogs_create_post,
  blogs_logout_get,
  blogs_details_get,
  blogs_delete,
};
