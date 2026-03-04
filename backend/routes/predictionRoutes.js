const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');

// Create new prediction
router.post('/', predictionController.createPrediction.bind(predictionController));

// Get prediction history by email
router.get('/history', predictionController.getPredictionHistory.bind(predictionController));

// Get prediction by ID
router.get('/:id', predictionController.getPredictionById.bind(predictionController));

module.exports = router;
