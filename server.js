const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// 🔗 MongoDB URL (পরে Vercel এ add করবে)
const MONGO_URL = process.env.MONGO_URL;

// Connect DB
mongoose.connect(MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Movie Schema
const Movie = mongoose.model("Movie", {
  title: String,
  poster: String,
  releaseDate: String,
  views: { type: Number, default: 0 }
});

// ➕ Add Movie
app.post("/add", async (req, res) => {
  const movie = await Movie.create(req.body);
  res.json(movie);
});

// 📥 Get Movies
app.get("/movies", async (req, res) => {
  const movies = await Movie.find().sort({ views: -1 });
  res.json(movies);
});

// 🔍 Search
app.get("/search", async (req, res) => {
  const q = req.query.q;
  const movies = await Movie.find({
    title: { $regex: q, $options: "i" }
  });
  res.json(movies);
});

app.listen(3000, () => console.log("Server running"));

const path = require("path");

// Homepage route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
