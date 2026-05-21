const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running...");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

const foodRoutes = require("./routes/foodRoutes");

app.use("/api/foods", foodRoutes);

app.use("/uploads", express.static("uploads"));

app.use(express.json());

const reviewRoutes = require("./routes/reviewRoutes");

app.use("/api/reviews", reviewRoutes);
