const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/buy', authMiddleware, portfolioController.buyStock);
router.post('/sell', authMiddleware, portfolioController.sellStock);

module.exports = router; 