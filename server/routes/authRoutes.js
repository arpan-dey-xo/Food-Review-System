const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!email.endsWith("@lpu.in")) {
      return res.status(400).json({
        message: "Use LPU Email ID",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({
      message: "User Registered Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      },
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.put(
  "/change-password",
  authMiddleware,

  async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;

      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);

      if (!isMatch) {
        return res.status(400).json({
          message: "Old password incorrect",
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      user.password = hashedPassword;

      await user.save();

      res.json({
        message: "Password Changed Successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
);

router.get("/profile", authMiddleware, async (req, res) => {
  res.json({
    message: "Protected Route Accessed",
    user: req.user,
  });
});

router.get(
  "/student",
  authMiddleware,
  roleMiddleware("student"),
  (req, res) => {
    res.json({
      message: "Welcome Student",
    });
  },
);

router.get("/vendor", authMiddleware, roleMiddleware("vendor"), (req, res) => {
  res.json({
    message: "Welcome Vendor",
  });
});

router.get("/admin", authMiddleware, roleMiddleware("admin"), (req, res) => {
  res.json({
    message: "Welcome Admin",
  });
});

router.get(
  "/all-users",

  authMiddleware,

  roleMiddleware("admin"),

  async (req, res) => {
    try {
      const users = await User.find().select("-password");

      res.json(users);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
);

router.delete(
  "/delete-user/:id",

  authMiddleware,

  roleMiddleware("admin"),

  async (req, res) => {
    try {
      if (req.user.id === req.params.id) {
        return res.status(400).json({
          message: "Admin cannot delete own account",
        });
      }

      const userToDelete = await User.findById(req.params.id);

      if (userToDelete.role === "admin") {
        return res.status(400).json({
          message: "Admins cannot delete other admins",
        });
      }

      await User.findByIdAndDelete(req.params.id);

      res.json({
        message: "User Deleted Successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
);

module.exports = router;
