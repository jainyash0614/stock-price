const prisma = require('../models/prismaClient');

exports.getMarketEvents = async (req, res) => {
  try {
    const events = await prisma.marketEvent.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: { stock: true },
    });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch market events', error: err.message });
  }
}; 