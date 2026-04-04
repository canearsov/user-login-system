const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// =========================
//  ACTIVE USERS
// =========================
let activeUsers = [];

// =========================
//  REGISTRACIJA
// =========================
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ msg: 'Prosimo, izpolnite vsa polja' });

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'Uporabnik že obstaja' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword });
    await user.save();

    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// =========================
//  LOGIN
// =========================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ msg: 'Prosimo, izpolnite vsa polja' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Uporabnik ne obstaja' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Napačno geslo' });

    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });

    // Dodaj v activeUsers
    if (!activeUsers.includes(user.email)) {
        activeUsers.push(user.email);
    }
    console.log("ACTIVE USERS:", activeUsers); // DEBUG

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// =========================
//  GET LOGGED-IN USER
// =========================
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'Uporabnik ni najden' });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// =========================
//  ACTIVE USERS ROUTE
// =========================
router.get('/active-users', (req, res) => {
    res.json(activeUsers);
});

// =========================
//  LOGOUT
// =========================
router.post('/logout', (req, res) => {
    const { email } = req.body;
    activeUsers = activeUsers.filter(u => u !== email);
    console.log("ACTIVE USERS AFTER LOGOUT:", activeUsers); // DEBUG
    res.json({ message: "Logged out" });
});

module.exports = router;
