const prisma = require('../models/prismaClient');

exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await prisma.leaderboard.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      },
      orderBy: {
        rank: 'asc'
      },
      take: 10
    });

    const formattedLeaderboard = leaderboard.map(entry => ({
      id: entry.id,
      rank: entry.rank,
      totalValue: entry.totalValue,
      user: {
        id: entry.user.id,
        username: entry.user.username,
        email: entry.user.email
      }
    }));

    res.json(formattedLeaderboard);
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ message: 'Failed to fetch leaderboard', error: err.message });
  }
}; 