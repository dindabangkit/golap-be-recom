const express = require('express');
const dotenv = require('dotenv');
const recommendationRoutes = require('./routes/recommendationRoutes');

const app = express();
dotenv.config();  // Memuat file .env

const port = process.env.PORT || 8080;

// Middleware untuk parse JSON body
app.use(express.json());

// Menambahkan routing untuk model prediksi dan rekomendasi
app.use('/api', recommendationRoutes);

// Menjalankan server dan mendengarkan pada alamat 0.0.0.0 untuk akses jaringan
app.listen(port, () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
});