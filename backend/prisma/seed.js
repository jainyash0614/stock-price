const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const famousStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 150 },
  { symbol: 'GOOG', name: 'Alphabet Inc.', price: 2800 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 700 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 3400 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 300 },
  { symbol: 'META', name: 'Meta Platforms', price: 350 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 800 },
  { symbol: 'NFLX', name: 'Netflix Inc.', price: 500 },
  { symbol: 'BABA', name: 'Alibaba Group', price: 90 },
  { symbol: 'DIS', name: 'Walt Disney Co.', price: 100 },
];

async function main() {
  // Delete all market events
  await prisma.marketEvent.deleteMany();

  // Get all stocks not in the famous list
  const famousSymbols = famousStocks.map(s => s.symbol);
  const stocksToDelete = await prisma.stock.findMany({
    where: { symbol: { notIn: famousSymbols } }
  });
  const stockIdsToDelete = stocksToDelete.map(s => s.id);

  // Delete all related data for those stocks
  if (stockIdsToDelete.length > 0) {
    await prisma.stockPriceHistory.deleteMany({ where: { stockId: { in: stockIdsToDelete } } });
    await prisma.holding.deleteMany({ where: { stockId: { in: stockIdsToDelete } } });
    await prisma.transaction.deleteMany({ where: { stockId: { in: stockIdsToDelete } } });
    await prisma.marketEvent.deleteMany({ where: { stockId: { in: stockIdsToDelete } } });
  }

  // Now delete the stocks
  await prisma.stock.deleteMany({
    where: { id: { in: stockIdsToDelete } }
  });

  // Upsert the 10 famous stocks
  for (const stock of famousStocks) {
    await prisma.stock.upsert({
      where: { symbol: stock.symbol },
      update: { name: stock.name, price: stock.price },
      create: stock,
    });
  }

  console.log('Reset to 10 famous stocks and cleared market events!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect()); 