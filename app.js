const express = require('express');
const mysql = require('mysql');
const bodyparser = require('body-parser');

const app = express();
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());


// Membuat koneksi MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'kapal_pelni'
});

connection.connect((err) => {
    if (err) {
        console.error("Terjadi kesalahan dalam koneksi ke MySQL:", err.stack);
        return;
    }
    console.log("Koneksi MySQL berhasil dengan ID " + connection.threadId);
});

// Menggunakan view 
app.set('view engine', 'ejs');

// Routing (Create, Read, Update, Delete) untuk kapal Pelni

// Menampilkan data kapal di halaman index
app.get('/', (req, res) => {
    const query = 'SELECT * FROM kapal';
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.render('index', { kapal: results });
    });
});

// Create / Input / Insert kapal
app.post('/add', (req, res) => {
    const { nama_kapal, jenis_kapal, kapasitas } = req.body;
    const query = 'INSERT INTO kapal (nama_kapal, jenis_kapal, kapasitas) VALUES (?, ?, ?)';
    connection.query(query, [nama_kapal, jenis_kapal, kapasitas], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Update - Akses halaman edit
app.get('/edit/:id', (req, res) => {
    const query = 'SELECT * FROM kapal WHERE id = ?';
    connection.query(query, [req.params.id], (err, result) => {
        if (err) throw err;
        res.render('edit', { kapal: result[0] });
    });
});

// Update - Simpan perubahan data kapal
app.post('/update/:id', (req, res) => {
    const { nama_kapal, jenis_kapal, kapasitas } = req.body;
    const query = 'UPDATE kapal SET nama_kapal = ?, jenis_kapal = ?, kapasitas = ? WHERE id = ?';
    connection.query(query, [nama_kapal, jenis_kapal, kapasitas, req.params.id], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Delete - Menghapus kapal
app.get('/delete/:id', (req, res) => {
    const query = 'DELETE FROM kapal WHERE id = ?';
    connection.query(query, [req.params.id], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Menjalankan server di port 3000
app.listen(3000, () => {
    console.log("Server berjalan di port 3000, buka web melalui http://localhost:3000");
});
