import React, { useState, useEffect } from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Typography, 
  Box,
  Chip,
  Fade,
  Slide,
  Grow,
  Paper
} from '@mui/material';
import { 
  EmojiEvents, 
  TrendingUp, 
  TrendingDown,
  Star,
  StarBorder
} from '@mui/icons-material';
import useLeaderboard from '../hooks/useLeaderboard';

const Leaderboard = () => {
  const { leaderboard, loading, error } = useLeaderboard();
  const [animatedItems, setAnimatedItems] = useState(new Set());

  useEffect(() => {
    if (leaderboard && leaderboard.length > 0) {
      // Animate new entries
      const newItems = new Set();
      leaderboard.forEach((item, index) => {
        if (index < 3) { // Only animate top 3
          setTimeout(() => {
            newItems.add(item.userId || item.id);
            setAnimatedItems(new Set(newItems));
          }, index * 200);
        }
      });
    }
  }, [leaderboard]);

  // Add error handling
  if (error) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body1" sx={{ color: '#ff4757' }}>
          Error loading leaderboard: {error}
        </Typography>
      </Box>
    );
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <EmojiEvents sx={{ color: '#FFD700', fontSize: 24 }} />;
      case 2:
        return <EmojiEvents sx={{ color: '#C0C0C0', fontSize: 20 }} />;
      case 3:
        return <EmojiEvents sx={{ color: '#CD7F32', fontSize: 18 }} />;
      default:
        return (
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 700,
              color: 'rgba(255, 255, 255, 0.7)',
              minWidth: 20,
              textAlign: 'center'
            }}
          >
            #{rank}
          </Typography>
        );
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return 'linear-gradient(135deg, #FFD700, #FFA500)';
      case 2:
        return 'linear-gradient(135deg, #C0C0C0, #A9A9A9)';
      case 3:
        return 'linear-gradient(135deg, #CD7F32, #B8860B)';
      default:
        return 'rgba(255, 255, 255, 0.05)';
    }
  };

  const formatValue = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getChangeColor = (change) => {
    return change >= 0 ? '#00ff88' : '#ff4757';
  };

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#fff' }}>
          Loading leaderboard...
        </Typography>
        {[1, 2, 3, 4, 5].map((i) => (
          <Box 
            key={i}
            sx={{ 
              height: 60, 
              mb: 1, 
              borderRadius: 2,
              background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.1) 25%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.1) 75%)',
              backgroundSize: '200% 100%',
              animation: 'loading 1.5s infinite'
            }}
          />
        ))}
      </Box>
    );
  }

  if (!leaderboard || leaderboard.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          No leaderboard data available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', overflow: 'hidden' }}>
      <List sx={{ p: 0 }}>
        {leaderboard.map((entry, index) => {
          const rank = index + 1;
          const isTopThree = rank <= 3;
          const isAnimated = animatedItems.has(entry.userId || entry.id);
          
          // Safety check for entry data
          if (!entry || !entry.username) {
            return null;
          }

          return (
            <Slide 
              key={entry.userId || entry.id} 
              direction="right" 
              in={true} 
              timeout={300 + index * 100}
              mountOnEnter 
              unmountOnExit
            >
              <ListItem
                className={`leaderboard-item ${isAnimated ? 'new-entry' : ''}`}
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  background: getRankColor(rank),
                  border: isTopThree ? '2px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                    transition: 'left 0.5s ease',
                  },
                  '&:hover::before': {
                    left: '100%',
                  },
                  '&:hover': {
                    transform: 'translateX(8px) scale(1.02)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                    borderColor: isTopThree ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 212, 255, 0.3)',
                  },
                  '&.new-entry': {
                    animation: 'highlight 1s ease-out',
                  }
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      background: isTopThree 
                        ? 'rgba(255, 255, 255, 0.2)' 
                        : 'linear-gradient(135deg, #00d4ff, #ff00ff)',
                      border: isTopThree ? '2px solid rgba(255, 255, 255, 0.5)' : 'none',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.1) rotate(5deg)',
                      }
                    }}
                  >
                    {getRankIcon(rank)}
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        component="span"
                        variant="body1"
                        sx={{
                          fontWeight: isTopThree ? 700 : 600,
                          color: 'text.primary',
                          fontSize: isTopThree ? '1.1rem' : '1rem',
                          textShadow: isTopThree ? '0 1px 2px rgba(0,0,0,0.3)' : 'none'
                        }}
                      >
                        {entry.username}
                      </Typography>
                      {isTopThree && (
                        <Star 
                          sx={{ 
                            color: '#FFD700', 
                            fontSize: 16,
                            animation: 'pulse 2s infinite'
                          }} 
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color: 'text.primary',
                          fontSize: '1.1rem'
                        }}
                      >
                        {formatValue(entry.totalValue || 0)}
                      </Typography>
                      
                      {entry.change !== undefined && (
                        <Chip
                          icon={entry.change >= 0 ? <TrendingUp /> : <TrendingDown />}
                          label={`${entry.change >= 0 ? '+' : ''}${entry.change.toFixed(2)}%`}
                          size="small"
                          sx={{
                            background: entry.change >= 0 ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 71, 87, 0.2)',
                            color: getChangeColor(entry.change),
                            border: `1px solid ${getChangeColor(entry.change)}30`,
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            height: 20,
                            '& .MuiChip-label': {
                              px: 1,
                            },
                            '&:hover': {
                              background: entry.change >= 0 ? 'rgba(0, 255, 136, 0.3)' : 'rgba(255, 71, 87, 0.3)',
                              transform: 'scale(1.05)',
                              transition: 'all 0.3s ease'
                            }
                          }}
                        />
                      )}
                    </Box>
                  }
                />

                {isTopThree && (
                  <Grow in={true} timeout={1000}>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -5,
                        right: -5,
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: 'rgba(255, 215, 0, 0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: 'pulse 2s infinite'
                      }}
                    >
                      <Typography variant="caption" sx={{ color: '#000', fontWeight: 700 }}>
                        {rank}
                      </Typography>
                    </Box>
                  </Grow>
                )}
              </ListItem>
            </Slide>
          );
        })}
      </List>
    </Box>
  );
};

export default Leaderboard;
