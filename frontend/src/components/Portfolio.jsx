import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Fade,
  Slide,
  Grow,
  Grid,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  ShowChart,
  Visibility,
  VisibilityOff,
  Star,
  StarBorder
} from '@mui/icons-material';
import useLivePrices from '../hooks/useLivePrices';
import { useAppContext } from '../context/AppContext';

const Portfolio = ({ portfolio, user, token }) => {
  const [showDetails, setShowDetails] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Get real-time stock prices
  const { data: livePrices, loading: livePricesLoading } = useLivePrices();
  
  // Get refresh functions from context
  const { refreshPortfolio, refreshTransactions } = useAppContext();

  // Get real stock price and calculate change
  const getStockPrice = (stockSymbol) => {
    if (!livePrices || !livePrices[stockSymbol] || livePrices[stockSymbol].length === 0) {
      return null;
    }
    return livePrices[stockSymbol][livePrices[stockSymbol].length - 1].price;
  };

  const getStockChange = (stockSymbol) => {
    if (!livePrices || !livePrices[stockSymbol] || livePrices[stockSymbol].length < 2) {
      return { change: 0, changePercent: 0 };
    }
    
    const currentPrice = livePrices[stockSymbol][livePrices[stockSymbol].length - 1].price;
    const previousPrice = livePrices[stockSymbol][livePrices[stockSymbol].length - 2].price;
    const change = currentPrice - previousPrice;
    const changePercent = (change / previousPrice) * 100;
    
    return { change, changePercent };
  };

  const formatValue = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercent = (value) => {
    if (value === undefined || value === null) return '+0.00%';
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getChangeColor = (change) => {
    return change >= 0 ? '#00ff88' : '#ff4757';
  };

  const getChangeIcon = (change) => {
    return change >= 0 ? <TrendingUp sx={{ color: '#00ff88' }} /> : <TrendingDown sx={{ color: '#ff4757' }} />;
  };

  const handleBuyStock = async (stockId, stockSymbol) => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('http://localhost:4000/api/portfolio/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          stockId: stockId,
          quantity: 1
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage(`Successfully bought 1 share of ${stockSymbol}!`);
        // Refresh portfolio and transactions data
        setTimeout(() => {
          refreshPortfolio();
          refreshTransactions();
        }, 1000);
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSellStock = async (stockId, stockSymbol, quantity) => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('http://localhost:4000/api/portfolio/sell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          stockId: stockId,
          quantity: 1
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage(`Successfully sold 1 share of ${stockSymbol}!`);
        // Refresh portfolio and transactions data
        setTimeout(() => {
          refreshPortfolio();
          refreshTransactions();
        }, 1000);
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!portfolio || !portfolio.holdings || portfolio.holdings.length === 0) {
    return (
      <Fade in={true} timeout={800}>
        <Box>
          <Typography variant="h4" sx={{ mb: 3, color: '#fff', fontWeight: 700 }}>
            📊 Portfolio Overview
          </Typography>
          
          {/* Portfolio Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ background: 'linear-gradient(135deg, #00d4ff, #ff00ff)' }}>
                      <AccountBalance />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Total Value
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                        {formatValue(portfolio?.totalValue || 0)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ background: 'linear-gradient(135deg, #00ff88, #00d4ff)' }}>
                      <ShowChart />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Available Balance
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                        {formatValue(user?.balance || 0)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Empty State */}
          <Paper sx={{
            p: 4,
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            textAlign: 'center'
          }}>
            <ShowChart sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.3)', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
              No Holdings Yet
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
              Start building your portfolio by buying some stocks!
            </Typography>
            <Chip 
              label="Go to Dashboard" 
              sx={{ 
                background: 'linear-gradient(135deg, #00d4ff, #ff00ff)',
                color: '#fff',
                fontWeight: 600
              }}
            />
          </Paper>
        </Box>
      </Fade>
    );
  }

  return (
    <Fade in={true} timeout={800}>
      <Box>
        <Typography variant="h4" sx={{ mb: 3, color: '#fff', fontWeight: 700 }}>
          📊 Portfolio Overview
        </Typography>
        
        {/* Message Display */}
        {message && (
          <Box sx={{ mb: 3 }}>
            <Chip 
              label={message}
              color={message.includes('Error') ? 'error' : 'success'}
              sx={{ 
                background: message.includes('Error') ? 'rgba(255, 71, 87, 0.2)' : 'rgba(0, 255, 136, 0.2)',
                color: message.includes('Error') ? '#ff4757' : '#00ff88',
                border: `1px solid ${message.includes('Error') ? '#ff4757' : '#00ff88'}30`,
                fontWeight: 600
              }}
            />
          </Box>
        )}
        
        {/* Portfolio Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 3
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ background: 'linear-gradient(135deg, #00d4ff, #ff00ff)' }}>
                    <AccountBalance />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Total Value
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                      {formatValue(portfolio.totalValue)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      +$4,543.21 today
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      {getChangeIcon(2.3)} {/* Simulated positive change */}
                      <Typography variant="caption" sx={{ color: getChangeColor(2.3) }}>
                        {formatPercent(2.3)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid xs={12} sm={6} md={3}>
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 3
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ background: 'linear-gradient(135deg, #00ff88, #00d4ff)' }}>
                    <ShowChart />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Available Balance
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                      {formatValue(user?.balance || 0)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 3
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ background: 'linear-gradient(135deg, #ffa726, #ff4757)' }}>
                    <Star />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Active Stocks
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                      {portfolio.holdings.length}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Holdings Table */}
        <Paper sx={{
          p: 3,
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
              Your Holdings
            </Typography>
            <Tooltip title={showDetails ? "Hide Details" : "Show Details"}>
              <IconButton 
                onClick={() => setShowDetails(!showDetails)}
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                {showDetails ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </Tooltip>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#fff', fontWeight: 600, border: 'none' }}>Stock</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 600, border: 'none' }}>Quantity</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 600, border: 'none' }}>Current Price</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 600, border: 'none' }}>Total Value</TableCell>
                  {showDetails && (
                    <>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, border: 'none' }}>Change</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, border: 'none' }}>Actions</TableCell>
                    </>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {portfolio.holdings.map((holding, index) => (
                  <Slide key={holding.stock.id} direction="up" in={true} timeout={300 + index * 100}>
                    <TableRow sx={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.05)',
                      }
                    }}>
                      <TableCell sx={{ color: '#fff', border: 'none' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ 
                            background: 'linear-gradient(135deg, #00d4ff, #ff00ff)',
                            width: 32,
                            height: 32
                          }}>
                            {holding.stock.symbol.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                              {holding.stock.symbol}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              {holding.stock.name}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: '#fff', border: 'none' }}>
                        {holding.quantity.toLocaleString()}
                      </TableCell>
                      <TableCell sx={{ color: '#fff', border: 'none' }}>
                        {(() => {
                          const realTimePrice = getStockPrice(holding.stock.symbol);
                          return formatValue(realTimePrice || holding.stock.price);
                        })()}
                      </TableCell>
                      <TableCell sx={{ color: '#fff', border: 'none' }}>
                        {(() => {
                          const realTimePrice = getStockPrice(holding.stock.symbol);
                          return formatValue(holding.quantity * (realTimePrice || holding.stock.price));
                        })()}
                      </TableCell>
                      {showDetails && (
                        <>
                          <TableCell sx={{ border: 'none' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {getChangeIcon(getStockChange(holding.stock.symbol).change)}
                              <Typography variant="body2" sx={{ color: getChangeColor(getStockChange(holding.stock.symbol).changePercent) }}>
                                {formatPercent(getStockChange(holding.stock.symbol).changePercent)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ border: 'none' }}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Chip 
                                label={loading ? "Buying..." : "Buy"} 
                                size="small"
                                onClick={() => handleBuyStock(holding.stock.id, holding.stock.symbol)}
                                disabled={loading}
                                sx={{ 
                                  background: '#00ff88',
                                  color: '#000',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  '&:hover': {
                                    background: '#00cc6a',
                                    transform: 'scale(1.05)'
                                  }
                                }}
                              />
                              <Chip 
                                label={loading ? "Selling..." : "Sell"} 
                                size="small"
                                onClick={() => handleSellStock(holding.stock.id, holding.stock.symbol, holding.quantity)}
                                disabled={loading || holding.quantity <= 0}
                                sx={{ 
                                  background: '#ff4757',
                                  color: '#fff',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  '&:hover': {
                                    background: '#ff3742',
                                    transform: 'scale(1.05)'
                                  }
                                }}
                              />
                            </Box>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  </Slide>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Fade>
  );
};

export default Portfolio; 