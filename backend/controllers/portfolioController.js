const prisma = require('../models/prismaClient');

// Get Socket.IO instance
let io;
const setIO = (socketIO) => {
  io = socketIO;
};

async function recalculatePortfolioValue(userId) {
  const portfolio = await prisma.portfolio.findUnique({
    where: { userId },
    include: { holdings: { include: { stock: true } } },
  });
  let totalValue = 0;
  for (const holding of portfolio.holdings) {
    totalValue += holding.quantity * holding.stock.price;
  }
  await prisma.portfolio.update({ where: { userId }, data: { totalValue } });
}

// Emit real-time updates
async function emitPortfolioUpdate(userId) {
  if (!io) return;
  
  try {
    // Get updated portfolio
    const portfolio = await prisma.portfolio.findUnique({
      where: { userId },
      include: { 
        holdings: { 
          include: { stock: true } 
        } 
      },
    });
    
    // Get updated user
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    // Emit portfolio update
    io.emit('portfolioUpdate', { portfolio, user });
    
    // Emit leaderboard update
    const leaderboard = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        balance: true,
        portfolio: {
          select: { totalValue: true }
        }
      },
      orderBy: [
        { portfolio: { totalValue: 'desc' } },
        { balance: 'desc' }
      ],
      take: 10
    });
    
    // Transform to match expected structure
    const transformedLeaderboard = leaderboard.map((user, index) => ({
      userId: user.id,
      username: user.username,
      totalValue: user.portfolio?.totalValue || user.balance || 0,
      rank: index + 1
    }));
    
    io.emit('leaderboard', transformedLeaderboard);
    
  } catch (error) {
    console.error('Error emitting portfolio update:', error);
  }
}

exports.buyStock = async (req, res) => {
  const userId = req.user.userId;
  const { stockId, quantity } = req.body;
  if (quantity <= 0) return res.status(400).json({ message: 'Quantity must be positive' });
  
  try {
    // Get user and stock info
    const [user, stock] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.stock.findUnique({ where: { id: stockId } })
    ]);
    
    if (!stock) return res.status(404).json({ message: 'Stock not found' });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const totalCost = quantity * stock.price;
    
    // Check if user has enough balance
    if (user.balance < totalCost) {
      return res.status(400).json({ 
        message: `Insufficient balance. You need $${totalCost.toFixed(2)} but have $${user.balance.toFixed(2)}` 
      });
    }
    
    // Get or create portfolio
    let portfolio = await prisma.portfolio.findUnique({ where: { userId } });
    if (!portfolio) {
      portfolio = await prisma.portfolio.create({ data: { userId } });
    }
    
    // Update user balance
    await prisma.user.update({
      where: { id: userId },
      data: { balance: { decrement: totalCost } }
    });
    
    // Upsert holding
    const holding = await prisma.holding.upsert({
      where: { portfolioId_stockId: { portfolioId: portfolio.id, stockId: stock.id } },
      update: { quantity: { increment: quantity } },
      create: { portfolioId: portfolio.id, stockId: stock.id, quantity },
    });
    
    // Create transaction
    await prisma.transaction.create({
      data: {
        userId,
        stockId: stock.id,
        type: 'BUY',
        quantity,
        price: stock.price,
      },
    });
    
    await recalculatePortfolioValue(userId);
    await emitPortfolioUpdate(userId);
    
    // Get updated user info
    const updatedUser = await prisma.user.findUnique({ where: { id: userId } });
    
    res.json({ 
      message: 'Stock bought successfully', 
      holding,
      newBalance: updatedUser.balance,
      totalCost
    });
  } catch (err) {
    console.error('Buy stock error:', err);
    res.status(500).json({ message: 'Buy failed', error: err.message });
  }
};

exports.sellStock = async (req, res) => {
  const userId = req.user.userId;
  const { stockId, quantity } = req.body;
  if (quantity <= 0) return res.status(400).json({ message: 'Quantity must be positive' });
  
  try {
    // Get user and stock info
    const [user, stock] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.stock.findUnique({ where: { id: stockId } })
    ]);
    
    if (!stock) return res.status(404).json({ message: 'Stock not found' });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Get portfolio
    const portfolio = await prisma.portfolio.findUnique({ where: { userId } });
    if (!portfolio) {
      return res.status(400).json({ message: 'No portfolio found' });
    }
    
    // Check if user has enough stock to sell
    const holding = await prisma.holding.findUnique({
      where: { portfolioId_stockId: { portfolioId: portfolio.id, stockId } },
    });
    
    if (!holding || holding.quantity < quantity) {
      return res.status(400).json({ 
        message: `Not enough stock to sell. You have ${holding?.quantity || 0} shares but trying to sell ${quantity}` 
      });
    }
    
    const totalValue = quantity * stock.price;
    
    // Update user balance (add money from sale)
    await prisma.user.update({
      where: { id: userId },
      data: { balance: { increment: totalValue } }
    });
    
    // Update holding
    await prisma.holding.update({
      where: { portfolioId_stockId: { portfolioId: portfolio.id, stockId } },
      data: { quantity: { decrement: quantity } },
    });
    
    // Create transaction
    await prisma.transaction.create({
      data: {
        userId,
        stockId: stock.id,
        type: 'SELL',
        quantity,
        price: stock.price,
      },
    });
    
    await recalculatePortfolioValue(userId);
    await emitPortfolioUpdate(userId);
    
    // Get updated user info
    const updatedUser = await prisma.user.findUnique({ where: { id: userId } });
    
    res.json({ 
      message: 'Stock sold successfully', 
      newBalance: updatedUser.balance,
      totalValue
    });
  } catch (err) {
    console.error('Sell stock error:', err);
    res.status(500).json({ message: 'Sell failed', error: err.message });
  }
}; 

// Export the setIO function
exports.setIO = setIO; 