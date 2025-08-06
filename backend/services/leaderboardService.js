const prisma = require('../models/prismaClient');

async function emitLeaderboard(io) {
  // Get top 10 from cache
  const topUsers = await prisma.leaderboard.findMany({
    orderBy: { rank: 'asc' },
    take: 10,
    include: { user: { select: { id: true, username: true } } },
  });
  io.emit('leaderboard', topUsers.map(p => ({
    userId: p.user.id,
    username: p.user.username,
    totalValue: p.totalValue,
    rank: p.rank,
  })));
}

async function updateLeaderboardCache() {
  // Get top 10 portfolios
  const topPortfolios = await prisma.portfolio.findMany({
    orderBy: { totalValue: 'desc' },
    take: 10,
    include: { user: true },
  });
  // Upsert into Leaderboard table
  for (let i = 0; i < topPortfolios.length; i++) {
    const p = topPortfolios[i];
    await prisma.leaderboard.upsert({
      where: { userId: p.userId },
      update: { rank: i + 1, totalValue: p.totalValue },
      create: { userId: p.userId, rank: i + 1, totalValue: p.totalValue },
    });
  }
  // Remove users not in top 10
  await prisma.leaderboard.deleteMany({
    where: { userId: { notIn: topPortfolios.map(p => p.userId) } },
  });
}

function startLeaderboardUpdates(io) {
  setInterval(async () => {
    await updateLeaderboardCache();
    await emitLeaderboard(io);
  }, 10000);
}

module.exports = { startLeaderboardUpdates, emitLeaderboard, updateLeaderboardCache }; 