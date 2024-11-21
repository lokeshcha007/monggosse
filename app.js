const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

// Database Connection
mongoose.connect("mongodb://localhost:27017/moengageDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schema and Model
const listSchema = {
  name: String,
  creationDate: Date,
  responseCodes: [String],
  imageLinks: [String],
};

const List = mongoose.model("List", listSchema);

// Routes

// Home (Login)
app.get("/", (req, res) => {
  res.render("login");
});

// Signup Page
app.get("/signup", (req, res) => {
  res.render("signup");
});

// Search Page
app.get("/search", (req, res) => {
  res.render("search", { results: [] });
});

// Handle Filter Search
app.post("/search", async (req, res) => {
  const filter = req.body.filter; // e.g., "2xx" or "203"
  const codes = [];
  const images = [];
  for (let i = 200; i < 1000; i++) {
    if (filter === "2xx" || filter === `${i}`) {
      codes.push(`${i}`);
      images.push(`https://http.dog/${i}.jpg`);
    }
  }
  res.render("search", { results: codes.map((code, index) => ({ code, image: images[index] })) });
});

// Save Filtered List
app.post("/save-list", async (req, res) => {
  const { name, codes, images } = req.body;
  const newList = new List({
    name,
    creationDate: new Date(),
    responseCodes: JSON.parse(codes),
    imageLinks: JSON.parse(images),
  });
  await newList.save();
  res.redirect("/lists");
});

// Lists Page
app.get("/lists", async (req, res) => {
  const lists = await List.find();
  res.render("lists", { lists });
});

// View Single List
app.get("/lists/:id", async (req, res) => {
  const list = await List.findById(req.params.id);
  res.render("edit-list", { list });
});

// Delete List
app.delete("/lists/:id", async (req, res) => {
  await List.findByIdAndDelete(req.params.id);
  res.redirect("/lists");
});

// Start Server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

echo "# monggosse" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/lokeshcha007/monggosse.git
git push -u origin main