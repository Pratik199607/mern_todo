const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

//Create a new router instance
const router = express.Router();

//Register functiom
router.post('/register', async (req, res) => {
  try {
    
    const { email, password } = req.body;
    console.log(req.body);
    
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // Create a new user
    const newUser = new User({
      email,
      password
    });
    
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    // Save User
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) { 
    console.error('Error registering user:', error);
    res.status(500).json({ message: `Internal server error${error}` });
  }
});

// Login Function
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log(user._id);

    // If user not found or password doesn't match
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Generate and sign a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(200).json({ message: 'Login successful', token, userId: user._id });
    
  } catch (error) {
    res.status(500).json({ error: `Failed to login  ${error}` });
  }
});

module.exports = router;