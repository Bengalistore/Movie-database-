const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

// Movie Schema
const Movie = mongoose.model("Movie", {
  title: String,
  poster: String,
  releaseDate: String,
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Admin page
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

// Movie Details page
app.get("/movie/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "movie.html"));
});

// ➕ Add
app.post("/add", async (req, res) => {
  const movie = await Movie.create(req.body);
  res.json(movie);
});

// 📥 All Movies
app.get("/movies", async (req, res) => {
  const movies = await Movie.find().sort({ createdAt: -1 });
  res.json(movies);
});

// 🔥 Trending (7 days)
app.get("/trending", async (req, res) => {
  const last7days = new Date();
  last7days.setDate(last7days.getDate() - 7);

  const movies = await Movie.find({
    createdAt: { $gte: last7days }
  }).sort({ views: -1 });

  res.json(movies);
});

// 👁️ View + Details
app.get("/movie-data/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  movie.views += 1;
  await movie.save();
  res.json(movie);
});

// ✏️ Update
app.put("/update/:id", async (req, res) => {
  await Movie.findByIdAndUpdate(req.params.id, req.body);
  res.json({ success: true });
});

// ❌ Delete
app.delete("/delete/:id", async (req, res) => {
  await Movie.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.listen(3000, () => console.log("Server running"));
