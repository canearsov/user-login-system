const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Povezava na MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Static files (frontend)
app.use(express.static('public'));

// Routes
app.use('/api/auth', require('./routes/auth'));

// Port za Railway
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
