const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8555;

// Define User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  mobile: { type: String },
  password: { type: String, required: true }
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

// Register (create new user) endpoint
app.post("/create", async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Check if the user already exists by email or name
    const existingUser = await User.findOne({ 
      $or: [{ email }, { name }]
    });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: existingUser.email === email ? "Email already registered. Please log in." : "Username already exists."
      });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, mobile, password: hashedPassword });
    await newUser.save();

    res.json({ success: true, message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Registration failed. Please try again." });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;

    // Find user by username
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found. Please sign up." });
    }

    // Compare input password with stored hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ success: false, message: "Incorrect password. Please try again." });
    }

    // Login successful
    res.json({ success: true, message: "Login successful!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
});


// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/IPL_Prediction", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log("Failed to connect to MongoDB:", err));
