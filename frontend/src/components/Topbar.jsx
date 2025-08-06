import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  Badge, 
  Avatar, 
  Menu, 
  MenuItem, 
  Tooltip,
  Fade,
  Slide,
  Chip,
  Box,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  Brightness4, 
  Brightness7, 
  Notifications, 
  AccountCircle,
  Logout,
  Settings,
  Person,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

const Topbar = ({ darkMode, onToggleTheme, notifications = [], onToggleSidebar }) => {
  const { logout, user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <Slide direction="down" in={true} mountOnEnter unmountOnExit>
      <div className="topbar">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isMobile && (
            <IconButton
              onClick={onToggleSidebar}
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                '&:hover': {
                  color: '#00d4ff',
                  transform: 'scale(1.1)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(45deg, #00d4ff, #ff00ff)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'pulse 2s infinite'
            }}
          >
            StockSim Pro
        </Typography>
          
          <Chip 
            label="Live Trading" 
            color="success" 
            size="small"
            sx={{ 
              animation: 'pulse 2s infinite',
              '& .MuiChip-label': {
                fontWeight: 600
              }
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Theme Toggle */}
          <Tooltip title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}>
            <IconButton 
              onClick={onToggleTheme}
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                '&:hover': {
                  color: '#00d4ff',
                  transform: 'rotate(180deg)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton 
              onClick={handleNotificationMenuOpen}
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                '&:hover': {
                  color: '#ff00ff',
                  transform: 'scale(1.1)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              <Badge 
                badgeContent={unreadNotifications} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    animation: unreadNotifications > 0 ? 'pulse 1s infinite' : 'none'
                  }
                }}
              >
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* User Menu */}
          <Tooltip title="User menu">
            <IconButton 
              onClick={handleProfileMenuOpen}
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                '&:hover': {
                  color: '#00d4ff',
                  transform: 'scale(1.1)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32,
                  background: 'linear-gradient(45deg, #00d4ff, #ff00ff)',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    transition: 'all 0.3s ease'
                  }
                }}
              >
                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={handleMenuClose}
          TransitionComponent={Fade}
          PaperProps={{
            sx: {
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              minWidth: 300,
              maxHeight: 400
            }
          }}
        >
          <MenuItem sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Typography variant="h6" sx={{ color: '#fff' }}>
              Notifications ({notifications.length})
            </Typography>
          </MenuItem>
          
          {notifications.length === 0 ? (
            <MenuItem>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                No notifications
              </Typography>
            </MenuItem>
          ) : (
            notifications.slice(0, 5).map((notification, index) => (
              <MenuItem 
                key={index}
                sx={{ 
                  borderBottom: index < notifications.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ color: '#fff', fontWeight: notification.read ? 400 : 600 }}>
                    {notification.message}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                    {(() => {
                      try {
                        const date = new Date(notification.timestamp);
                        return isNaN(date.getTime()) ? 'Just now' : date.toLocaleString();
                      } catch (error) {
                        return 'Just now';
                      }
                    })()}
                  </Typography>
                </Box>
              </MenuItem>
            ))
          )}
        </Menu>

        {/* User Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          TransitionComponent={Fade}
          PaperProps={{
            sx: {
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              minWidth: 200
            }
          }}
        >
          <MenuItem sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar 
                sx={{ 
                  width: 40, 
                  height: 40,
                  background: 'linear-gradient(45deg, #00d4ff, #ff00ff)'
                }}
              >
                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
              <Box>
                <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>
                  {user?.username || 'User'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {user?.email || 'user@example.com'}
                </Typography>
              </Box>
            </Box>
          </MenuItem>
          
          <MenuItem 
            onClick={handleMenuClose}
            sx={{ 
              '&:hover': { background: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            <Person sx={{ mr: 2, color: 'rgba(255, 255, 255, 0.7)' }} />
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Profile
            </Typography>
          </MenuItem>
          
          <MenuItem 
            onClick={handleMenuClose}
            sx={{ 
              '&:hover': { background: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            <Settings sx={{ mr: 2, color: 'rgba(255, 255, 255, 0.7)' }} />
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Settings
            </Typography>
          </MenuItem>
          
          <MenuItem 
            onClick={handleLogout}
            sx={{ 
              '&:hover': { background: 'rgba(255, 0, 0, 0.1)' }
            }}
          >
            <Logout sx={{ mr: 2, color: '#ff4757' }} />
            <Typography sx={{ color: '#ff4757' }}>
              Logout
            </Typography>
          </MenuItem>
        </Menu>
        </div>
    </Slide>
  );
};

export default Topbar;