// file: api/server.js (Versi MySQL)

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql'); // Import library mysql

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// --- 1. KONEKSI DATABASE ---
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // User default XAMPP
    password: '',      // Password default XAMPP biasanya kosong
    database: 'db_catea'
});

db.connect((err) => {
    if (err) {
        console.error('Gagal konek ke database:', err);
    } else {
        console.log('Berhasil terhubung ke Database MySQL...');
    }
});

// --- 2. ROUTES API (CRUD dengan SQL) ---

// READ (GET) - Ambil semua data
app.get('/api/menu', (req, res) => {
    const sql = 'SELECT * FROM menu';
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(200).json({
            message: "Data menu dari MySQL",
            data: result
        });
    });
});

// CREATE (POST) - Tambah data
app.post('/api/menu', (req, res) => {
    const data = req.body;
    const sql = 'INSERT INTO menu SET ?';
    
    db.query(sql, data, (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({
            message: "Menu berhasil disimpan ke Database!",
            id: result.insertId,
            data: data
        });
    });
});

// UPDATE (PUT) - Edit data
app.put('/api/menu/:id', (req, res) => {
    const id = req.params.id;
    const data = req.body;
    // Query update SQL standard
    const sql = 'UPDATE menu SET nama=?, kategori=?, harga=?, deskripsi=? WHERE id=?';
    
    db.query(sql, [data.nama, data.kategori, data.harga, data.deskripsi, id], (err, result) => {
        if (err) return res.status(500).json(err);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Menu tidak ditemukan" });
        }

        res.status(200).json({ message: "Menu berhasil diupdate" });
    });
});

// DELETE (DELETE) - Hapus data
app.delete('/api/menu/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM menu WHERE id=?';

    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Menu tidak ditemukan" });
        }

        res.status(200).json({ message: "Menu berhasil dihapus permanen" });
    });
});

// --- FITUR AUTH (Register & Login) ---

// Endpoint Register
app.post('/api/register', (req, res) => {
    // Pastikan nama variabel ini SAMA dengan yang dikirim dari HTML (JSON.stringify)
    const { nama, email, username, password } = req.body;
    
    // Debugging: Tampilkan di terminal VS Code biar ketahuan data masuk atau tidak
    console.log("Menerima Request Register:", req.body); 

    if (!nama || !email || !username || !password) {
        return res.status(400).json({ message: "Data tidak lengkap!" });
    }

    // Pastikan urutan VALUES (?,?,?,?) sesuai urutan kolom
    const sql = 'INSERT INTO users (nama, email, username, password) VALUES (?, ?, ?, ?)';
    
    db.query(sql, [nama, email, username, password], (err, result) => {
        if (err) {
            console.error("Error Database:", err); // Biar error tampil di terminal
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: "Username sudah dipakai!" });
            }
            return res.status(500).json({ message: "Gagal menyimpan ke database", error: err });
        }
        res.status(201).json({ message: "Registrasi Berhasil" });
    });
});

// 6. LOGIN (Masuk Akun)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    
    db.query(sql, [username, password], (err, results) => {
        if (err) return res.status(500).json(err);

        // Jika user ditemukan
        if (results.length > 0) {
            const user = results[0];
            res.status(200).json({
                message: "Login Berhasil",
                user: {
                    id: user.id,
                    nama: user.nama,
                    username: user.username
                }
            });
        } else {
            // Jika tidak ditemukan
            res.status(401).json({ message: "Username atau Password salah!" });
        }
    });
});

// Jalankan Server
app.listen(PORT, () => {
    console.log(`Server MySQL CaTea berjalan di http://localhost:${PORT}`);
});