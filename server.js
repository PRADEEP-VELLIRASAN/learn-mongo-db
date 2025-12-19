const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const studentsRouter = require('./routes/students');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/students', studentsRouter);

const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/studentsdb';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
