const { db, bucket } = require('../config/firebase');
const admin = require('firebase-admin');
const serviceAccount = require('path/to/serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://capstone-project-442901.firebaseio.com"
});

// Fungsi untuk memberikan rekomendasi laptop berdasarkan harga
function getRecommendation(laptopData, model) {
    if (laptopData.price > 2000) {
        return 'We recommend checking premium models like Dell XPS or MacBook Pro.';
    } else if (laptopData.price > 1000) {
        return 'This is a good mid-range option. We recommend checking laptops from HP or Lenovo.';
    } else {
        return 'This is an affordable laptop. Consider looking at budget models from Acer or ASUS.';
    }
}

async function getRecommendations(req, res) {
    const laptopData = req.body;

    try {
        // Mengunduh model dari Firebase Storage
        const modelFile = await bucket.file('model-recommendation.json').download();
        const model = JSON.parse(modelFile.toString('utf8'));  // Misalnya model disimpan dalam format JSON

        // Mengambil rekomendasi untuk laptop berdasarkan model yang diunduh
        const recommendation = getRecommendation(laptopData, model);
        console.log(`Recommendation: ${recommendation}`);

        // Kirim rekomendasi ke API response
        res.status(200).json({
            recommendation,
            message: 'Recommendation generated successfully',
        });
    } catch (error) {
        console.error('Error downloading model from Firebase:', error);
        res.status(500).json({
            error: 'Failed to generate recommendation',
        });
    }
}

const getSampleData = async () => {
    const snapshot = await db.collection('sample_collection').get();
    const data = [];
    snapshot.forEach(doc => {
        data.push(doc.data());
    });
    return data;
};

module.exports = { getRecommendations };
const db = admin.firestore();
