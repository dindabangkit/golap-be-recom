const axios = require('axios');
const admin = require('firebase-admin');
const path = require('path');

// Ganti dengan jalur ke file JSON kredensial Anda
const serviceAccount = require(path.join(__dirname, '../credentials/firebase-credentials.json'));

// Inisialisasi Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Fungsi untuk mendapatkan rekomendasi berdasarkan harga
const getRecommendationByPrice = async (req, res) => {
    console.log("Request body:", req.body);
    console.log("Request query:", req.query);
    try {
        const price = req.body.price || req.query.price;

        // Validasi input
        if (!price) {
            return res.status(400).json({ error: "Price is required" });
        }
        console.log("Searching for laptops with Price_in_Rupee <= ", price);

        // Ambil data dari Firestore berdasarkan harga
        const laptops = await db.collection('sample_collection')
            .where('Price_in_Rupee', '<=', parseFloat(price)) // Mengambil laptop dengan harga kurang dari atau sama dengan harga yang dimasukkan
            .get();
        
        console.log("Query result:", laptops.docs.length); // Log jumlah dokumen yang ditemukan

        const recommendedLaptops = [];
        laptops.forEach(doc => {
            recommendedLaptops.push({ id: doc.id, ...doc.data() });
        });

        if (recommendedLaptops.length === 0) {
            return res.status(404).json({ message: "No laptops found within the specified price range" });
        }

        // Mengirim respons
        return res.status(200).json({
            recommendations: recommendedLaptops,
            message: "Recommendations generated successfully"
        });
    } catch (error) {
        console.error("Error generating recommendations:", error);
        return res.status(500).json({ error: "Failed to generate recommendations" });
    }
};

// Ekspor fungsi
module.exports = {
    getRecommendationByPrice,
};