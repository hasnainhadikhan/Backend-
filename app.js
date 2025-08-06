const express = require("express");
const mongoose = require("mongoose");
const User = require("./model/user.js");
const app = express();
const port = 3000;

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/your_db_name", {})
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "stylesheets")));
app.get("/", (req, res) => {
  res.render("index", { title: "Home Page" });
});
app.get("/read",async  (req, res) => {
 let user = await User.find()
 res.render("read",{ user , title: "Read Page" });
});
app.post("/create", async (req, res) => {
  const { name, email, imageurl } = req.body;
  const user = new User({
    name,
    email,
    imageurl,
  });
  try {
    await user.save();
    res.redirect("/read");
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/delete/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    await User.findOneAndDelete({ _id: userId });
    res.redirect("/read");
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Internal Server Error");
  }
});
// Show edit form
app.get("/edit/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.render("edit", { user }); // render edit.ejs
  } catch (error) {
    console.error("Error loading edit page:", error);
    res.status(500).send("Error loading edit page");
  }
});
// Update user
app.post("/edit/:id", async (req, res) => {
  try {
    const { name, email, imageurl } = req.body;
    await User.findByIdAndUpdate(req.params.id, { name, email, imageurl });
    res.redirect("/read");
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Error updating user");
  }
});

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
