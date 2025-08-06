const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/history', authMiddleware, transactionController.getTransactionHistory);

module.exports = router; 