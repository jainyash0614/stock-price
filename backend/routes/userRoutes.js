const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/me', authMiddleware, userController.getUserInfo);
router.get('/portfolio', authMiddleware, userController.getPortfolio);
router.put('/balance', authMiddleware, userController.updateBalance);
router.get('/stocks', userController.getAllStocks); // No auth required for testing

module.exports = router; 