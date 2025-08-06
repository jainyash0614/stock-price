const express = require('express');
const router = express.Router();
const marketEventController = require('../controllers/marketEventController');

router.get('/history', marketEventController.getMarketEvents);

module.exports = router; 