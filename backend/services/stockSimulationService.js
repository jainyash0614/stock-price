const prisma = require('../models/prismaClient');

// Make lastEventTime persistent by storing it in database
let lastEventTime = 0;
let marketSentiment = 0; // -1 to 1 (bearish to bullish)
let volatilityIndex = 0.3; // Market volatility level

// Initialize lastEventTime from database or use current time
async function initializeEventTime() {
  try {
    const lastEvent = await prisma.marketEvent.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    
    if (lastEvent) {
      lastEventTime = lastEvent.createdAt.getTime();
      console.log(`📅 Last event time initialized: ${new Date(lastEventTime).toLocaleString()}`);
    } else {
      lastEventTime = Date.now() - (5 * 60 * 1000); // Start 5 minutes ago
      console.log(`📅 No previous events found, starting 5 minutes ago`);
    }
  } catch (error) {
    console.error('Error initializing event time:', error);
    lastEventTime = Date.now() - (5 * 60 * 1000);
  }
}

// Enhanced realistic price simulation using Geometric Brownian Motion
function simulateStockPrice(oldPrice, stockVolatility = 0.3) {
  const drift = 0.0001; // Small upward drift (0.01% per update)
  const volatility = stockVolatility * volatilityIndex; // Adjust based on market conditions
  const timeStep = 1/144; // Assuming 144 updates per day (10-minute intervals)
  
  // Random shock with normal distribution approximation
  const randomShock = (Math.random() - 0.5) * 2 * volatility * Math.sqrt(timeStep);
  
  // Add market sentiment influence
  const sentimentInfluence = marketSentiment * 0.001;
  
  // Calculate new price with drift, volatility, and sentiment
  const newPrice = oldPrice * (1 + drift + randomShock + sentimentInfluence);
  
  // Ensure price doesn't go below $0.01
  return Math.max(0.01, +newPrice.toFixed(2));
}

// Enhanced market event system with better distribution
async function maybeTriggerMarketEvent(io) {
  const now = Date.now();
  const timeSinceLastEvent = now - lastEventTime;
  const minInterval = 3 * 60 * 1000; // 3 minutes minimum between events
  
  if (timeSinceLastEvent < minInterval) {
    return; // Too soon for next event
  }

  // Get recent event distribution to balance it
  const recentEvents = await prisma.marketEvent.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10
  });
  
  // Count recent events by type
  const recentCounts = { CRASH: 0, SURGE: 0, IPO: 0, NEWS: 0, ROTATION: 0 };
  recentEvents.forEach(event => {
    recentCounts[event.type] = (recentCounts[event.type] || 0) + 1;
  });
  
  // Calculate adjusted probabilities based on recent distribution
  const totalRecent = recentEvents.length;
  const baseProbabilities = { CRASH: 0.25, SURGE: 0.25, IPO: 0.2, NEWS: 0.15, ROTATION: 0.15 };
  const adjustedProbabilities = {};
  
  Object.keys(baseProbabilities).forEach(type => {
    const recentRatio = totalRecent > 0 ? recentCounts[type] / totalRecent : 0;
    const adjustment = Math.max(0, baseProbabilities[type] - recentRatio);
    adjustedProbabilities[type] = baseProbabilities[type] + adjustment;
  });
  
  // Normalize probabilities
  const totalProb = Object.values(adjustedProbabilities).reduce((sum, prob) => sum + prob, 0);
  Object.keys(adjustedProbabilities).forEach(type => {
    adjustedProbabilities[type] /= totalProb;
  });
  
  const eventChance = Math.random();
  let cumulativeProb = 0;
  let selectedEvent = 'CRASH'; // Default fallback
  
  for (const [eventType, probability] of Object.entries(adjustedProbabilities)) {
    cumulativeProb += probability;
    if (eventChance <= cumulativeProb) {
      selectedEvent = eventType;
      break;
    }
  }
  
  console.log(`🎲 Event trigger: ${selectedEvent} (chance: ${eventChance.toFixed(3)}, time since last: ${Math.floor(timeSinceLastEvent/1000)}s)`);
  
  // Trigger the selected event
  switch (selectedEvent) {
    case 'CRASH':
      await triggerMarketCrash(io);
      break;
    case 'SURGE':
      await triggerMarketSurge(io);
      break;
    case 'IPO':
      await triggerIPO(io);
      break;
    case 'NEWS':
      await triggerNewsEvent(io);
      break;
    case 'ROTATION':
      await triggerSectorRotation(io);
      break;
  }
  
  lastEventTime = now;
}

// Market crash event
async function triggerMarketCrash(io) {
  marketSentiment = -0.8;
  volatilityIndex = 0.8;
  
  const stocks = await prisma.stock.findMany();
  const crashSeverity = 0.1 + Math.random() * 0.15; // 10-25% drop
  
  for (const stock of stocks) {
    const drop = 1 - (crashSeverity + Math.random() * 0.1);
    const newPrice = Math.max(0.01, stock.price * drop);
    await prisma.stock.update({ 
      where: { id: stock.id }, 
      data: { price: newPrice } 
    });
  }
  
  const crashMessages = [
    'Market crash! Stocks plummeted across the board.',
    'Panic selling hits the market!',
    'Black Monday strikes again!',
    'Market correction turns into crash!',
    'Investors flee as market tumbles!'
  ];
  
  const message = crashMessages[Math.floor(Math.random() * crashMessages.length)];
  await prisma.marketEvent.create({ 
    data: { type: 'CRASH', description: message } 
  });
  io.emit('marketEvent', { type: 'CRASH', message, severity: crashSeverity });
}

// Market surge event
async function triggerMarketSurge(io) {
  marketSentiment = 0.8;
  volatilityIndex = 0.6;
  
  const stocks = await prisma.stock.findMany();
  const surgeSeverity = 0.05 + Math.random() * 0.15; // 5-20% gain
  
  for (const stock of stocks) {
    const gain = 1 + (surgeSeverity + Math.random() * 0.1);
    const newPrice = stock.price * gain;
    await prisma.stock.update({ 
      where: { id: stock.id }, 
      data: { price: newPrice } 
    });
  }
  
  const surgeMessages = [
    'Market rally! Stocks surge across the board.',
    'Bull market momentum continues!',
    'Investors celebrate as market soars!',
    'Green day for all major indices!',
    'Market euphoria drives prices higher!'
  ];
  
  const message = surgeMessages[Math.floor(Math.random() * surgeMessages.length)];
  await prisma.marketEvent.create({ 
    data: { type: 'SURGE', description: message } 
  });
  io.emit('marketEvent', { type: 'SURGE', message, severity: surgeSeverity });
}

// IPO event
async function triggerIPO(io) {
  const famousIPOs = [
    { symbol: 'ABNB', name: 'Airbnb Inc.', price: 150, volatility: 0.4 },
    { symbol: 'SNOW', name: 'Snowflake Inc.', price: 250, volatility: 0.5 },
    { symbol: 'UBER', name: 'Uber Technologies', price: 60, volatility: 0.4 },
    { symbol: 'COIN', name: 'Coinbase Global', price: 250, volatility: 0.6 },
    { symbol: 'LYFT', name: 'Lyft Inc.', price: 50, volatility: 0.4 },
    { symbol: 'ZM', name: 'Zoom Video', price: 120, volatility: 0.5 },
    { symbol: 'SPOT', name: 'Spotify Technology', price: 140, volatility: 0.4 },
    { symbol: 'PINS', name: 'Pinterest Inc.', price: 70, volatility: 0.4 },
    { symbol: 'DASH', name: 'DoorDash Inc.', price: 130, volatility: 0.5 },
    { symbol: 'PLTR', name: 'Palantir Technologies', price: 25, volatility: 0.6 },
    { symbol: 'RBLX', name: 'Roblox Corp.', price: 80, volatility: 0.5 },
    { symbol: 'CRWD', name: 'CrowdStrike Holdings', price: 200, volatility: 0.5 },
    { symbol: 'NET', name: 'Cloudflare Inc.', price: 100, volatility: 0.5 },
    { symbol: 'SQ', name: 'Square Inc.', price: 120, volatility: 0.4 },
    { symbol: 'SHOP', name: 'Shopify Inc.', price: 150, volatility: 0.4 }
  ];
  
  const existingSymbols = (await prisma.stock.findMany()).map(s => s.symbol);
  const availableIPOs = famousIPOs.filter(stock => !existingSymbols.includes(stock.symbol));
  
  if (availableIPOs.length > 0) {
    const newStock = availableIPOs[Math.floor(Math.random() * availableIPOs.length)];
    const createdStock = await prisma.stock.create({
      data: { 
        symbol: newStock.symbol, 
        name: newStock.name, 
        price: newStock.price,
        volatility: newStock.volatility,
        ipo: true 
      }
    });
    
    const ipoMessages = [
      `Hot IPO: ${createdStock.symbol} debuts on the market!`,
      `New listing: ${createdStock.symbol} goes public!`,
      `IPO frenzy: ${createdStock.symbol} hits the market!`,
      `Investors rush to buy ${createdStock.symbol} IPO!`,
      `${createdStock.symbol} makes its market debut!`
    ];
    
    const message = ipoMessages[Math.floor(Math.random() * ipoMessages.length)];
    await prisma.marketEvent.create({
      data: { type: 'IPO', description: message, stockId: createdStock.id }
    });
    io.emit('marketEvent', { type: 'IPO', message, stock: createdStock });
  }
}

// News event affecting specific stocks
async function triggerNewsEvent(io) {
  const newsEvents = [
    {
      type: 'EARNINGS',
      description: 'Tech earnings beat expectations!',
      affectedSectors: ['AAPL', 'GOOG', 'MSFT', 'META', 'NVDA'],
      impact: 0.05 + Math.random() * 0.1 // 5-15% positive
    },
    {
      type: 'REGULATION',
      description: 'New regulations hit tech sector!',
      affectedSectors: ['AAPL', 'GOOG', 'META', 'AMZN'],
      impact: -(0.03 + Math.random() * 0.08) // 3-11% negative
    },
    {
      type: 'INNOVATION',
      description: 'Breakthrough in AI technology!',
      affectedSectors: ['NVDA', 'GOOG', 'MSFT', 'PLTR'],
      impact: 0.08 + Math.random() * 0.12 // 8-20% positive
    },
    {
      type: 'ECONOMIC',
      description: 'Interest rates affect market sentiment!',
      affectedSectors: ['AAPL', 'GOOG', 'MSFT', 'AMZN', 'TSLA'],
      impact: (Math.random() - 0.5) * 0.1 // -5% to +5%
    }
  ];
  
  const event = newsEvents[Math.floor(Math.random() * newsEvents.length)];
  const stocks = await prisma.stock.findMany({
    where: { symbol: { in: event.affectedSectors } }
  });
  
  for (const stock of stocks) {
    const newPrice = Math.max(0.01, stock.price * (1 + event.impact));
    await prisma.stock.update({ 
      where: { id: stock.id }, 
      data: { price: newPrice } 
    });
  }
  
  await prisma.marketEvent.create({ 
    data: { type: 'NEWS', description: event.description } 
  });
  io.emit('marketEvent', { 
    type: 'NEWS', 
    message: event.description, 
    affectedStocks: stocks.map(s => s.symbol),
    impact: event.impact 
  });
}

// Sector rotation event
async function triggerSectorRotation(io) {
  const sectors = {
    tech: ['AAPL', 'GOOG', 'MSFT', 'META', 'NVDA', 'TSLA'],
    consumer: ['AMZN', 'NFLX', 'DIS', 'BABA'],
    growth: ['SNOW', 'PLTR', 'COIN', 'DASH', 'ABNB']
  };
  
  const sectorNames = Object.keys(sectors);
  const winningSector = sectorNames[Math.floor(Math.random() * sectorNames.length)];
  const losingSector = sectorNames[(sectorNames.indexOf(winningSector) + 1) % sectorNames.length];
  
  // Boost winning sector
  const winningStocks = await prisma.stock.findMany({
    where: { symbol: { in: sectors[winningSector] } }
  });
  
  for (const stock of winningStocks) {
    const gain = 1 + (0.03 + Math.random() * 0.07); // 3-10% gain
    const newPrice = stock.price * gain;
    await prisma.stock.update({ 
      where: { id: stock.id }, 
      data: { price: newPrice } 
    });
  }
  
  // Drop losing sector
  const losingStocks = await prisma.stock.findMany({
    where: { symbol: { in: sectors[losingSector] } }
  });
  
  for (const stock of losingStocks) {
    const drop = 1 - (0.02 + Math.random() * 0.06); // 2-8% drop
    const newPrice = Math.max(0.01, stock.price * drop);
    await prisma.stock.update({ 
      where: { id: stock.id }, 
      data: { price: newPrice } 
    });
  }
  
  const rotationMessages = [
    `Sector rotation: ${winningSector} stocks surge while ${losingSector} falls!`,
    `Investors rotate from ${losingSector} to ${winningSector}!`,
    `${winningSector} sector leads market gains!`,
    `Money flows from ${losingSector} to ${winningSector} stocks!`
  ];
  
  const message = rotationMessages[Math.floor(Math.random() * rotationMessages.length)];
  await prisma.marketEvent.create({ 
    data: { type: 'ROTATION', description: message } 
  });
  io.emit('marketEvent', { 
    type: 'ROTATION', 
    message, 
    winningSector, 
    losingSector 
  });
}

// Gradually normalize market sentiment and volatility
function normalizeMarketConditions() {
  if (marketSentiment > 0) {
    marketSentiment = Math.max(0, marketSentiment - 0.01);
  } else if (marketSentiment < 0) {
    marketSentiment = Math.min(0, marketSentiment + 0.01);
  }
  
  if (volatilityIndex > 0.3) {
    volatilityIndex = Math.max(0.3, volatilityIndex - 0.005);
  }
}

async function simulateStockPrices(io) {
  // Initialize event time from database
  await initializeEventTime();
  
  // Ensure there are some stocks in the DB
  let stocks = await prisma.stock.findMany();
  if (stocks.length === 0) {
    // Seed with some stocks with realistic prices and volatility
    const seedStocks = [
      { symbol: 'AAPL', name: 'Apple Inc.', price: 150, volatility: 0.25 },
      { symbol: 'GOOG', name: 'Alphabet Inc.', price: 2800, volatility: 0.3 },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 250, volatility: 0.5 },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 3200, volatility: 0.35 },
      { symbol: 'MSFT', name: 'Microsoft Corp.', price: 300, volatility: 0.25 },
      { symbol: 'META', name: 'Meta Platforms', price: 350, volatility: 0.4 },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 450, volatility: 0.45 },
      { symbol: 'NFLX', name: 'Netflix Inc.', price: 180, volatility: 0.4 },
      { symbol: 'LYFT', name: 'Lyft Inc.', price: 12, volatility: 0.6 },
      { symbol: 'ABNB', name: 'Airbnb Inc.', price: 140, volatility: 0.4 },
      { symbol: 'ZM', name: 'Zoom Video', price: 65, volatility: 0.5 },
      { symbol: 'DIS', name: 'Walt Disney Co.', price: 85, volatility: 0.3 },
      { symbol: 'DASH', name: 'DoorDash Inc.', price: 45, volatility: 0.5 },
      { symbol: 'SNOW', name: 'Snowflake Inc.', price: 180, volatility: 0.5 },
      { symbol: 'COIN', name: 'Coinbase Global', price: 120, volatility: 0.6 },
      { symbol: 'PLTR', name: 'Palantir Technologies', price: 25, volatility: 0.6 },
      { symbol: 'PINS', name: 'Pinterest Inc.', price: 30, volatility: 0.4 },
      { symbol: 'SPOT', name: 'Spotify Technology', price: 200, volatility: 0.4 },
      { symbol: 'UBER', name: 'Uber Technologies', price: 40, volatility: 0.5 },
      { symbol: 'BABA', name: 'Alibaba Group', price: 80, volatility: 0.4 }
    ];
    for (const stock of seedStocks) {
      await prisma.stock.create({ data: stock });
    }
    stocks = await prisma.stock.findMany();
  }

  console.log('🚀 Stock simulation started with persistent event timing');

  setInterval(async () => {
    // Update prices with enhanced simulation
    const updatedStocks = [];
    for (const stock of stocks) {
      const newPrice = simulateStockPrice(stock.price, stock.volatility || 0.3);
      const updated = await prisma.stock.update({ 
        where: { id: stock.id }, 
        data: { price: newPrice } 
      });
      updatedStocks.push(updated);
      
      // Record price history
      await prisma.stockPriceHistory.create({
        data: { stockId: stock.id, price: newPrice }
      });
    }
    
    // Emit updated prices
    io.emit('stockPrices', updatedStocks);
    
    // Maybe trigger a market event
    await maybeTriggerMarketEvent(io);
    
    // Normalize market conditions
    normalizeMarketConditions();
    
    // Refresh stocks list (in case of IPO)
    stocks = await prisma.stock.findMany();
  }, 10000); // Update every 10 seconds
}

module.exports = { simulateStockPrices }; 