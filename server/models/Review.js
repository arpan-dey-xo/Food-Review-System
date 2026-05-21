const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
    },

    review: {
      type: String,

      enum: ["Excellent", "Good", "Average", "Bad"],

      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Review", reviewSchema);
