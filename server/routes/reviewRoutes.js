const express = require("express");

const Review = require("../models/Review");

const Food = require("../models/Food");

const authMiddleware = require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/add",
  authMiddleware,
  roleMiddleware("student"),

  async (req, res) => {
    try {
      const { foodId, review } = req.body;

      const food = await Food.findById(foodId);

      if (!food) {
        return res.status(404).json({
          message: "Food Not Found",
        });
      }

      const existingReview = await Review.findOne({
        studentId: req.user.id,
        foodId,
      });

      if (existingReview) {
        return res.status(400).json({
          message: "You already reviewed this food",
        });
      }

      const newReview = new Review({
        studentId: req.user.id,
        foodId,
        review,
      });

      await newReview.save();

      res.status(201).json({
        message: "Review Added Successfully",
        review: newReview,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
);

router.get("/:foodId", async (req, res) => {
  try {
    const reviews = await Review.find({
      foodId: req.params.foodId,
    });

    const totalReviews = reviews.length;

    res.json({
      totalReviews,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
