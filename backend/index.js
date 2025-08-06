const { app, server, io } = require('./config/server');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const marketEventRoutes = require('./routes/marketEventRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const { simulateStockPrices } = require('./services/stockSimulationService');
const { startLeaderboardUpdates, emitLeaderboard } = require('./services/leaderboardService');

// Set Socket.IO instance for portfolio controller
const portfolioController = require('./controllers/portfolioController');
if (portfolioController.setIO) {
  portfolioController.setIO(io);
}

const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.send('Stock Market Simulation Game Backend is running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/market-events', marketEventRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  emitLeaderboard(io);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  simulateStockPrices(io);
  startLeaderboardUpdates(io);
}); 