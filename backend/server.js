const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database(':memory:');

// Initialize tables
db.serialize(() => {
  db.run('CREATE TABLE items (id INTEGER PRIMARY KEY, name TEXT, quantity INTEGER, min_quantity INTEGER, cost REAL)');
});

// Routes
app.get('/api/items', (req, res) => {
  db.all('SELECT * FROM items', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/items', (req, res) => {
  const { name, quantity, min_quantity, cost } = req.body;
  db.run('INSERT INTO items (name, quantity, min_quantity, cost) VALUES (?, ?, ?, ?)', [name, quantity, min_quantity, cost], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// Placeholder payment route
app.post('/api/pay', (req, res) => {
  res.json({ status: 'success', message: 'Pagamento simulado' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
