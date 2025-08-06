import React, { useState } from 'react';
import { 
  Container, 
  Grid, 
  Box, 
  Typography,
  Fade,
  Slide,
  Grow,
  Paper
} from '@mui/material';
import SummaryCard from './SummaryCard';
import LivePriceChart from './LivePriceChart';
import Leaderboard from './Leaderboard';
import EventFeed from './EventFeed';
import TransactionHistory from './TransactionHistory';
import UserProfile from './UserProfile';
import Watchlist from './Watchlist';
import Settings from './Settings';
import Portfolio from './Portfolio';
import usePortfolio from '../hooks/usePortfolio';
import useLivePrices from '../hooks/useLivePrices';
import useLeaderboard from '../hooks/useLeaderboard';
import useEvents from '../hooks/useEvents';
import useTransactions from '../hooks/useTransactions';

const Dashboard = ({ portfolio, user, token, activeSection }) => {
  const { data: livePrices, loading: livePricesLoading, error: livePricesError } = useLivePrices();
  const { leaderboard, loading: leaderboardLoading, error: leaderboardError } = useLeaderboard();
  const { events, loading: eventsLoading, error: eventsError } = useEvents();
  const { transactions, loading: transactionsLoading, error: transactionsError } = useTransactions(token);



  // Calculate portfolio metrics
  const totalValue = portfolio?.totalValue || 0;
  // Simulate realistic portfolio changes for dashboard
  const totalChange = 4543.21; // Simulated daily change
  const totalChangePercent = 2.3; // Simulated percentage change
  const availableBalance = user?.balance || 0;
  const totalStocks = portfolio?.holdings?.length || 0;

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <Fade in={true} timeout={800}>
            <Box>
              {/* Summary Cards */}
              <Grid container spacing={3} className="dashboard-grid" sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <SummaryCard
                    title="Portfolio Value"
                    value={totalValue}
                    change={totalChange}
                    changePercent={totalChangePercent}
                    icon="balance"
                    type={totalChange >= 0 ? 'success' : 'error'}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <SummaryCard
                    title="Available Balance"
                    value={availableBalance}
                    icon="balance"
                    type="info"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <SummaryCard
                    title="Active Stocks"
                    value={totalStocks}
                    icon="chart"
                    type="warning"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <SummaryCard
                    title="Market Events"
                    value={events?.length || 0}
                    icon="notifications"
                    type="info"
                  />
                </Grid>
              </Grid>

              {/* Main Content Grid */}
              <Grid container spacing={3}>
                {/* Live Price Chart */}
                <Grid size={{ xs: 12, lg: 8 }}>
                  <Slide direction="up" in={true} timeout={1000}>
                    <Paper 
                      className="chart-container"
                      sx={{ 
                        p: 3,
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: 'rgba(0, 212, 255, 0.3)',
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
                        }
                      }}
                    >
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          mb: 2, 
                          color: '#fff',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        📈 Live Market Charts
                      </Typography>
                      <LivePriceChart history={livePrices} token={token} />
                    </Paper>
                  </Slide>
                </Grid>

                {/* Leaderboard */}
                <Grid size={{ xs: 12, lg: 4 }}>
                  <Slide direction="up" in={true} timeout={1200}>
                    <Paper 
                      sx={{ 
                        p: 3,
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 3,
                        height: 'fit-content',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: 'rgba(255, 0, 255, 0.3)',
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
                        }
                      }}
                    >
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          mb: 2, 
                          color: '#fff',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        🏆 Live Leaderboard
                      </Typography>
                      <Leaderboard />
                    </Paper>
                  </Slide>
                </Grid>

                {/* Market Events */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Slide direction="up" in={true} timeout={1400}>
                    <Paper 
                      sx={{ 
                        p: 3,
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 3,
                        height: 400,
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: 'rgba(255, 166, 38, 0.3)',
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
                        }
                      }}
                    >
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          mb: 2, 
                          color: '#fff',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        📰 Market Events
                      </Typography>
                      <EventFeed />
                    </Paper>
                  </Slide>
                </Grid>

                {/* Transaction History */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Slide direction="up" in={true} timeout={1600}>
                    <Paper 
                      sx={{ 
                        p: 3,
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 3,
                        height: 400,
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: 'rgba(0, 255, 136, 0.3)',
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
                        }
                      }}
                    >
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          mb: 2, 
                          color: 'text.primary',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        💰 Transaction History
                      </Typography>
                      <TransactionHistory token={token} />
                    </Paper>
                  </Slide>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        );

      case 'portfolio':
        return <Portfolio portfolio={portfolio} user={user} token={token} />;

      case 'watchlist':
        return <Watchlist />;

      case 'charts':
        return (
          <Fade in={true} timeout={800}>
            <Box>
              <Typography variant="h4" sx={{ mb: 3, color: 'text.primary', fontWeight: 700 }}>
                📈 Advanced Charts
              </Typography>
              <LivePriceChart history={livePrices} token={token} />
            </Box>
          </Fade>
        );

      case 'leaderboard':
        return (
          <Fade in={true} timeout={800}>
            <Box>
              <Typography variant="h4" sx={{ mb: 3, color: 'text.primary', fontWeight: 700 }}>
                🏆 Leaderboard
              </Typography>
              <Leaderboard />
            </Box>
          </Fade>
        );

      case 'events':
        return (
          <Fade in={true} timeout={800}>
            <Box>
              <Typography variant="h4" sx={{ mb: 3, color: 'text.primary', fontWeight: 700 }}>
                📰 Market Events
              </Typography>
              <EventFeed />
            </Box>
          </Fade>
        );

      case 'profile':
        return <UserProfile />;

      case 'settings':
        return <Settings />;

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Grow in={true} timeout={1000}>
        <Box>
          {renderSection()}
        </Box>
      </Grow>
    </Container>
  );
};

export default Dashboard;