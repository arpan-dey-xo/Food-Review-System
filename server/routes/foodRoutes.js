const express = require("express");

const Food = require("../models/Food");

const authMiddleware = require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post(
  "/add",
  authMiddleware,
  roleMiddleware("vendor"),
  upload.single("image"),

  async (req, res) => {
    try {
      const { name, description, price } = req.body;

      const newFood = new Food({
        name,
        description,
        price,

        image: req.file ? req.file.filename : "",

        vendorId: req.user.id,
      });

      await newFood.save();

      res.status(201).json({
        message: "Food Added Successfully",
        food: newFood,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
);

router.get("/", async (req, res) => {
  try {
    const foods = await Food.find().populate("vendorId", "name email");

    res.json(foods);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.delete(
  "/delete/:id",

  authMiddleware,

  roleMiddleware("admin"),

  async (req, res) => {
    try {
      await Food.findByIdAndDelete(req.params.id);

      res.json({
        message: "Food Deleted Successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
);

module.exports = router;
