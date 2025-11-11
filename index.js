const express = require('express');
const path = require('path');
const crypto = require('crypto');
const mysql = require('mysql2');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'diva1234',
  database: 'db_api',
  port: 3380
});

db.connect((err) => {
  if (err) {
    console.error('❌ Koneksi ke database gagal:', err);
  } else {
    console.log('✅ Terhubung ke database MySQL!');
  }
});

// ✅ Route utama
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ Endpoint untuk buat API key
app.post('/create', (req, res) => {
  const { apiName } = req.body;

  if (!apiName || apiName.trim() === '') {
    return res.status(400).json({ error: 'Nama API tidak boleh kosong.' });
  }

  // Generate API key dari crypto
  const apiKey = crypto.randomBytes(16).toString('hex');

  // Simpan hanya kolom api ke database
  const sql = 'INSERT INTO tugas_api (api) VALUES (?)';
  db.query(sql, [apiKey], (err, result) => {
    if (err) {
      console.error('❌ Gagal menyimpan ke database:', err);
      return res.status(500).json({ error: 'Gagal menyimpan data ke database.' });
    }

    console.log(`✅ API key disimpan: ${apiKey}`);
    res.json({ apiName, api: apiKey });
  });
});

app.listen(port, () => {
  console.log(`🚀 Server berjalan di http://localhost:${port}`);
});
