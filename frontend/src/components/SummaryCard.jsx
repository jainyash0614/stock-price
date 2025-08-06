import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip,
  Fade,
  Grow,
  Slide
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  AccountBalance,
  ShowChart,
  Leaderboard,
  Notifications
} from '@mui/icons-material';

const SummaryCard = ({ title, value, change, changePercent, icon, type = 'default', animate = true }) => {
  const isPositive = change >= 0;
  const isNegative = change < 0;
  
  const getIcon = () => {
    switch (icon) {
      case 'balance':
        return AccountBalance;
      case 'chart':
        return ShowChart;
      case 'leaderboard':
        return Leaderboard;
      case 'notifications':
        return Notifications;
      default:
        return AccountBalance;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'success':
        return '#00ff88';
      case 'warning':
        return '#ffa726';
      case 'error':
        return '#ff4757';
      case 'info':
        return '#00d4ff';
      default:
        return '#00d4ff';
    }
  };

  const formatValue = (val) => {
    if (typeof val === 'number') {
      // For counts (like Market Events, Active Stocks), show as number
      if (title === 'Market Events' || title === 'Active Stocks') {
        return val.toLocaleString();
      }
      // For currency values, show as currency
      return val.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
    return val;
  };

  const formatChange = (val) => {
    if (typeof val === 'number') {
      return val >= 0 ? `+${val.toFixed(2)}` : val.toFixed(2);
    }
    return val;
  };

  const formatChangePercent = (val) => {
    if (typeof val === 'number') {
      return val >= 0 ? `+${val.toFixed(2)}%` : `${val.toFixed(2)}%`;
    }
    return val;
  };

  const IconComponent = getIcon();

  const cardContent = (
    <Card 
      className="card"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, ${getTypeColor()}, ${getTypeColor()}80, ${getTypeColor()})`,
          transform: 'scaleX(0)',
          transition: 'transform 0.3s ease',
        },
        '&:hover::before': {
          transform: 'scaleX(1)',
        },
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: `0 16px 32px rgba(0, 0, 0, 0.3), 0 0 20px ${getTypeColor()}20`,
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography 
              variant="h6" 
              className="card-title"
              sx={{ 
                color: 'text.secondary',
                fontWeight: 500,
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
          {title}
        </Typography>
          </Box>
          
          <Box 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '12px',
              background: `linear-gradient(135deg, ${getTypeColor()}20, ${getTypeColor()}10)`,
              border: `1px solid ${getTypeColor()}30`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1) rotate(5deg)',
                background: `linear-gradient(135deg, ${getTypeColor()}30, ${getTypeColor()}20)`,
              }
            }}
          >
            <IconComponent 
              sx={{ 
                color: getTypeColor(),
                fontSize: '24px',
                transition: 'all 0.3s ease'
              }}
            />
          </Box>
        </Box>

        <Typography 
          variant="h4" 
          className={`card-value ${isPositive ? 'positive' : isNegative ? 'negative' : ''}`}
          sx={{ 
            fontWeight: 700,
            color: getTypeColor(),
            mb: 1,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
            transition: 'all 0.3s ease',
            '&.positive': {
              animation: 'pulse 2s infinite'
            },
            '&.negative': {
              animation: 'shake 0.5s ease-in-out'
            }
          }}
        >
          {formatValue(value)}
        </Typography>

        {(change !== undefined || changePercent !== undefined) && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            {change !== undefined && (
              <Chip
                icon={isPositive ? <TrendingUp /> : <TrendingDown />}
                label={formatChange(change)}
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
            )}
            
            {changePercent !== undefined && (
              <Typography 
                variant="body2" 
                className="card-change"
                sx={{ 
                  color: isPositive ? '#00ff88' : '#ff4757',
                  fontWeight: 600,
                  fontSize: '0.875rem'
                }}
              >
                {formatChangePercent(changePercent)}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );

  if (!animate) {
    return cardContent;
  }

  return (
    <Grow in={true} timeout={1000}>
      <Slide direction="up" in={true} timeout={800}>
        <Fade in={true} timeout={1200}>
          {cardContent}
        </Fade>
      </Slide>
    </Grow>
  );
};

export default SummaryCard;