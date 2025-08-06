const prisma = require('../models/prismaClient');

exports.getUserInfo = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, username: true, email: true, balance: true, createdAt: true }
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user info', error: err.message });
  }
};

exports.getPortfolio = async (req, res) => {
  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: req.user.userId },
      include: {
        holdings: {
          include: {
            stock: true
          }
        }
      }
    });
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch portfolio', error: err.message });
  }
};

exports.updateBalance = async (req, res) => {
  try {
    const { balance } = req.body;
    
    if (typeof balance !== 'number' || balance < 0) {
      return res.status(400).json({ message: 'Balance must be a positive number' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: { balance },
      select: { id: true, username: true, email: true, balance: true, createdAt: true }
    });

    res.json({ 
      message: 'Balance updated successfully', 
      user: updatedUser 
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update balance', error: err.message });
  }
};

// Get all stocks for testing
exports.getAllStocks = async (req, res) => {
  try {
    const stocks = await prisma.stock.findMany({
      orderBy: { symbol: 'asc' }
    });
    res.json(stocks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stocks', error: err.message });
  }
}; 