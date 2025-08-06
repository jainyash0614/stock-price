import React, { useState, useEffect } from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Typography, 
  Box,
  Chip,
  Fade,
  Slide,
  Grow,
  Paper
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  NewReleases,
  Warning,
  Info,
  Celebration,
  Timeline
} from '@mui/icons-material';
import useEvents from '../hooks/useEvents';

const EventFeed = () => {
  const { events, loading, error } = useEvents();
  const [animatedEvents, setAnimatedEvents] = useState(new Set());

  useEffect(() => {
    if (events && events.length > 0) {
      // Animate new events
      const newEvents = new Set();
      events.slice(0, 5).forEach((event, index) => {
        setTimeout(() => {
          newEvents.add(event.id);
          setAnimatedEvents(new Set(newEvents));
        }, index * 150);
      });
    }
  }, [events]);

  const getEventIcon = (type) => {
    switch (type) {
      case 'CRASH':
        return <TrendingDown sx={{ color: '#ff4757' }} />;
      case 'IPO':
        return <NewReleases sx={{ color: '#00ff88' }} />;
      case 'SURGE':
        return <TrendingUp sx={{ color: '#00ff88' }} />;
      case 'ROTATION':
        return <Timeline sx={{ color: '#ffa726' }} />;
      case 'NEWS':
        return <Info sx={{ color: '#00d4ff' }} />;
      default:
        return <Info sx={{ color: '#00d4ff' }} />;
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'CRASH':
        return '#ff4757';
      case 'IPO':
        return '#00ff88';
      case 'SURGE':
        return '#00ff88';
      case 'ROTATION':
        return '#ffa726';
      case 'NEWS':
        return '#00d4ff';
      default:
        return '#00d4ff';
    }
  };

  const getEventBackground = (type) => {
    const color = getEventColor(type);
    return `linear-gradient(135deg, ${color}10, ${color}05)`;
  };

  const formatDate = (dateString) => {
    try {
      // Handle both string dates and Date objects
      const date = dateString instanceof Date ? dateString : new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Just now';
      }
      
      const now = new Date();
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      
      if (diffInMinutes < 1) {
        return 'Just now';
      } else if (diffInMinutes < 60) {
        return `${diffInMinutes}m ago`;
      } else if (diffInMinutes < 1440) {
        const hours = Math.floor(diffInMinutes / 60);
        return `${hours}h ago`;
      } else {
        return date.toLocaleDateString();
      }
    } catch (error) {
      console.error('Date formatting error:', error, 'dateString:', dateString);
      return 'Just now';
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#fff' }}>
          Loading events...
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

  if (!events || events.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Timeline sx={{ fontSize: 48, color: 'rgba(255, 255, 255, 0.3)', mb: 2 }} />
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          No market events yet
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          Events will appear here as they happen
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', overflow: 'hidden' }}>
      <List sx={{ p: 0 }}>
        {events.slice(0, 10).map((event, index) => {
          const isAnimated = animatedEvents.has(event.id);
          const isNew = index < 3; // Consider first 3 events as "new"
          
          // Handle both socket events and database events
          const eventId = event.id || `socket-${index}-${Date.now()}`;
          const eventDescription = event.description || event.message || 'Market event';
          const eventCreatedAt = event.createdAt || new Date();
          
          return (
            <Slide 
              key={eventId} 
              direction="left" 
              in={true} 
              timeout={300 + index * 100}
              mountOnEnter 
              unmountOnExit
            >
              <ListItem
                className={`event-item ${isAnimated ? 'new-event' : ''}`}
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  background: getEventBackground(event.type),
                  border: `1px solid ${getEventColor(event.type)}30`,
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
                    background: `linear-gradient(90deg, transparent, ${getEventColor(event.type)}20, transparent)`,
                    transition: 'left 0.5s ease',
                  },
                  '&:hover::before': {
                    left: '100%',
                  },
                  '&:hover': {
                    transform: 'translateX(-8px) scale(1.02)',
                    boxShadow: `0 8px 24px rgba(0, 0, 0, 0.3), 0 0 20px ${getEventColor(event.type)}20`,
                    borderColor: `${getEventColor(event.type)}60`,
                  },
                  '&.new-event': {
                    animation: 'glow 2s ease-out',
                  }
                }}
              >
                <ListItemIcon>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: `${getEventColor(event.type)}20`,
                      border: `2px solid ${getEventColor(event.type)}40`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.2) rotate(10deg)',
                        background: `${getEventColor(event.type)}30`,
                      }
                    }}
                  >
                    {getEventIcon(event.type)}
                  </Box>
                </ListItemIcon>

                <ListItemText
                  primary={
                    <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={event.type}
                        size="small"
                        sx={{
                          background: `${getEventColor(event.type)}20`,
                          color: getEventColor(event.type),
                          border: `1px solid ${getEventColor(event.type)}40`,
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          height: 20,
                          '& .MuiChip-label': {
                            px: 1,
                          },
                          '&:hover': {
                            background: `${getEventColor(event.type)}30`,
                            transform: 'scale(1.05)',
                            transition: 'all 0.3s ease'
                          }
                        }}
                      />
                      {isNew && (
                        <Celebration 
                          sx={{ 
                            color: '#FFD700', 
                            fontSize: 16,
                            animation: 'pulse 1s infinite'
                          }} 
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box component="span" sx={{ mt: 0.5 }}>
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{
                          color: 'text.primary',
                          fontWeight: 500,
                          lineHeight: 1.4,
                          mb: 0.5,
                          display: 'block'
                        }}
                      >
                        {eventDescription}
                      </Typography>
                      <Typography
                        component="span"
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          fontSize: '0.75rem',
                          display: 'block'
                        }}
                      >
                        {formatDate(eventCreatedAt)}
                      </Typography>
                    </Box>
                  }
                />

                {isNew && (
                  <Grow in={true} timeout={1000}>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -3,
                        right: -3,
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        background: '#FFD700',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: 'pulse 1s infinite'
                      }}
                    >
                      <Typography variant="caption" sx={{ color: '#000', fontWeight: 700, fontSize: '0.6rem' }}>
                        NEW
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

export default EventFeed;
