const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

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
//  PRIDOBI PRIJAVLJENEGA UPORABNIKA
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

module.exports = router;
router.get('/profile', (req, res) => {
    const token = req.headers.authorization;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json(decoded);
    } catch (err) {
        res.status(401).send("Invalid token");
    }
});
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password'); // brez gesel
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Error fetching users" });
    }
});
