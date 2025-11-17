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
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'Uporabnik že obstaja' });

    user = new User({ name, email, password });

    // Šifriranje gesla
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // JWT
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "Uporabnik ne obstaja" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Napačno geslo" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,   // tukaj uporabiš svoj SECRET
            { expiresIn: "2h" }
        );

        res.json({ msg: "Prijava uspešna", token });

    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Napaka na serverju" });
    }
});


// =========================
//  PRIDOBI PRIJAVLJENEGA UPORABNIKA
// =========================
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) 
      return res.status(404).json({ msg: 'Uporabnik ni najden' });

    res.json(user);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
