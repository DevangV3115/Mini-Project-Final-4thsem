const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 🔥 Phase 1 imports
const solveRoute = require('./routes/solve');
const { getAnalytics } = require('./services/analytics');
const { getHistory } = require('./services/history');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Health route (existing)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// 🔥 MAIN ROUTE (Node → Python SSE bridge)
app.use('/api/solve', solveRoute);

// 📊 Analytics route
app.get('/api/analytics', (req, res) => {
  res.json(getAnalytics());
});

// 📜 History route
app.get('/api/history', (req, res) => {
  res.json(getHistory());
});

// (optional future routes)
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/chat', require('./routes/chat'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});