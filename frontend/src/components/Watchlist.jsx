import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  TextField, 
  Grid,
  Chip,
  IconButton,
  Fade,
  Slide,
  Grow,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  InputAdornment
} from '@mui/material';
import { 
  Add, 
  Remove, 
  Search,
  TrendingUp,
  TrendingDown,
  Star,
  StarBorder,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import useLivePrices from '../hooks/useLivePrices';

const Watchlist = () => {
  const { data: livePrices } = useLivePrices();
  const [watchlist, setWatchlist] = useState(['AAPL', 'GOOG', 'TSLA', 'AMZN', 'MSFT']);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [availableStocks, setAvailableStocks] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  // Mock available stocks - in real app this would come from API
  const allStocks = [
    'AAPL', 'GOOG', 'TSLA', 'AMZN', 'MSFT', 'META', 'NVDA', 'NFLX', 'CRM', 'ADBE',
    'PYPL', 'INTC', 'AMD', 'ORCL', 'IBM', 'CSCO', 'QCOM', 'TXN', 'AVGO', 'MU'
  ];

  useEffect(() => {
    // Filter available stocks based on search query
    const filtered = allStocks.filter(stock => 
      stock.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !watchlist.includes(stock)
    );
    setAvailableStocks(filtered);
  }, [searchQuery, watchlist]);

  const handleAddToWatchlist = (stock) => {
    if (!watchlist.includes(stock)) {
      setWatchlist(prev => [...prev, stock]);
      setShowAddDialog(false);
      setSearchQuery('');
      showNotification(`Added ${stock} to watchlist`, 'success');
    }
  };

  const handleRemoveFromWatchlist = (stock) => {
    setWatchlist(prev => prev.filter(s => s !== stock));
    showNotification(`Removed ${stock} from watchlist`, 'info');
  };

  const showNotification = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const getStockPrice = (symbol) => {
    if (!livePrices || !livePrices[symbol]) return null;
    const prices = livePrices[symbol];
    return prices.length > 0 ? prices[prices.length - 1].price : null;
  };

  const getStockChange = (symbol) => {
    if (!livePrices || !livePrices[symbol]) return null;
    const prices = livePrices[symbol];
    if (prices.length < 2) return null;
    
    const currentPrice = prices[prices.length - 1].price;
    const previousPrice = prices[prices.length - 2].price;
    const change = currentPrice - previousPrice;
    const changePercent = (change / previousPrice) * 100;
    
    return { change, changePercent };
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <Fade in={true} timeout={800}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>
            ⭐ Watchlist
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setShowAddDialog(true)}
            sx={{
              background: 'linear-gradient(135deg, #00ff88, #00d4ff)',
              '&:hover': {
                background: 'linear-gradient(135deg, #00d4ff, #00ff88)',
              }
            }}
          >
            Add Stock
          </Button>
        </Box>

        {showAlert && (
          <Slide direction="down" in={showAlert}>
            <Alert 
              severity={alertType}
              sx={{ 
                mb: 3, 
                background: alertType === 'success' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(0, 212, 255, 0.1)',
                border: alertType === 'success' ? '1px solid #00ff88' : '1px solid #00d4ff'
              }}
            >
              {alertMessage}
            </Alert>
          </Slide>
        )}

        {watchlist.length === 0 ? (
          <Slide direction="up" in={true} timeout={1000}>
            <Paper 
              sx={{ 
                p: 4,
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3
              }}
            >
              <Star sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.3)', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                Your watchlist is empty
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
                Add stocks to your watchlist to track their prices and performance
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowAddDialog(true)}
                sx={{
                  background: 'linear-gradient(135deg, #00ff88, #00d4ff)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #00d4ff, #00ff88)',
                  }
                }}
              >
                Add Your First Stock
              </Button>
            </Paper>
          </Slide>
        ) : (
          <Grid container spacing={2}>
            {watchlist.map((stock, index) => {
              const price = getStockPrice(stock);
              const change = getStockChange(stock);
              const isPositive = change && change.change > 0;
              const isNegative = change && change.change < 0;
              
              return (
                <Grid xs={12} sm={6} md={4} lg={3} key={stock}>
                  <Slide direction="up" in={true} timeout={800 + index * 100}>
                    <Paper
                      sx={{
                        p: 3,
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 3,
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '2px',
                          background: isPositive ? 'linear-gradient(90deg, #00ff88, #00d4ff)' : 
                                    isNegative ? 'linear-gradient(90deg, #ff4757, #ff6b7a)' :
                                    'linear-gradient(90deg, #00d4ff, #ff00ff)',
                          transform: 'scaleX(0)',
                          transition: 'transform 0.3s ease',
                        },
                        '&:hover::before': {
                          transform: 'scaleX(1)',
                        },
                        '&:hover': {
                          transform: 'translateY(-8px) scale(1.02)',
                          boxShadow: '0 16px 32px rgba(0, 0, 0, 0.3)',
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 0.5 }}>
                            {stock}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            {price ? formatPrice(price) : 'Loading...'}
                          </Typography>
                        </Box>
                        
                        <IconButton
                          onClick={() => handleRemoveFromWatchlist(stock)}
                          sx={{
                            color: 'rgba(255, 255, 255, 0.5)',
                            '&:hover': {
                              color: '#ff4757',
                              transform: 'scale(1.1)',
                            }
                          }}
                        >
                          <Remove />
                        </IconButton>
                      </Box>

                      {change && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Chip
                            icon={isPositive ? <TrendingUp /> : <TrendingDown />}
                            label={`${isPositive ? '+' : ''}${change.change.toFixed(2)} (${isPositive ? '+' : ''}${change.changePercent.toFixed(2)}%)`}
                            size="small"
                            sx={{
                              background: isPositive ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 71, 87, 0.2)',
                              color: isPositive ? '#00ff88' : '#ff4757',
                              border: `1px solid ${isPositive ? '#00ff88' : '#ff4757'}30`,
                              fontWeight: 600,
                              '&:hover': {
                                background: isPositive ? 'rgba(0, 255, 136, 0.3)' : 'rgba(255, 71, 87, 0.3)',
                                transform: 'scale(1.05)',
                                transition: 'all 0.3s ease'
                              }
                            }}
                          />
                        </Box>
                      )}

                      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{
                            borderColor: '#00d4ff',
                            color: '#00d4ff',
                            '&:hover': {
                              borderColor: '#00ff88',
                              color: '#00ff88',
                              background: 'rgba(0, 255, 136, 0.1)'
                            }
                          }}
                        >
                          Trade
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{
                            borderColor: '#ff00ff',
                            color: '#ff00ff',
                            '&:hover': {
                              borderColor: '#ff6b7a',
                              color: '#ff6b7a',
                              background: 'rgba(255, 0, 255, 0.1)'
                            }
                          }}
                        >
                          Chart
                        </Button>
                      </Box>
                    </Paper>
                  </Slide>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* Add Stock Dialog */}
        <Dialog 
          open={showAddDialog} 
          onClose={() => setShowAddDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 3
            }
          }}
        >
          <DialogTitle sx={{ color: '#fff', fontWeight: 600 }}>
            Add Stock to Watchlist
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              placeholder="Search stocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ mb: 2, mt: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                  </InputAdornment>
                ),
                sx: {
                  color: '#fff',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#00d4ff',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00d4ff',
                    },
                  },
                }
              }}
            />
            
            <List sx={{ maxHeight: 300, overflow: 'auto' }}>
              {availableStocks.map((stock) => (
                <ListItem
                  key={stock}
                  button
                  onClick={() => handleAddToWatchlist(stock)}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  <ListItemText 
                    primary={stock} 
                    sx={{ 
                      '& .MuiListItemText-primary': {
                        color: '#fff',
                        fontWeight: 600
                      }
                    }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleAddToWatchlist(stock)}
                      sx={{ color: '#00d4ff' }}
                    >
                      <Add />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setShowAddDialog(false)}
              sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default Watchlist; 