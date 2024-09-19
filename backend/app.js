const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const etablissementRoutes = require('./routes/etablissementRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const app = express();
const cors = require('cors');
const evalRoutes = require('./routes/evalRoutes');
app.use(cors({ origin: 'http://localhost:3000' }));

require('dotenv').config();
connectDB();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/etablissements', etablissementRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/eval', evalRoutes);


app.get('/', (req, res) => res.send('API is running...'));

module.exports = app;
