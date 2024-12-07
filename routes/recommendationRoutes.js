const express = require('express');
const router = express.Router();
const { getRecommendationByPrice } = require('../controllers/recommendationController');

// Route untuk mendapatkan rekomendasi berdasarkan harga
router.post('/recommendation-by-price', getRecommendationByPrice); // Pastikan ini sesuai dengan metode yang Anda inginkan
router.get('/recommendation-by-price', getRecommendationByPrice); // Metode GET

module.exports = router;