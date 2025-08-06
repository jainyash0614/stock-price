import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  IconButton,
  Tooltip,
  Fade,
  Slide
} from '@mui/material';
import { 
  Dashboard, 
  ShowChart, 
  Leaderboard, 
  Notifications, 
  AccountBalance,
  Person,
  Favorite,
  Settings,
  Menu as MenuIcon,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material';

const Sidebar = ({ collapsed, onToggle, activeSection, onSectionChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Dashboard },
    { id: 'portfolio', label: 'Portfolio', icon: AccountBalance },
    { id: 'watchlist', label: 'Watchlist', icon: Favorite },
    { id: 'charts', label: 'Charts', icon: ShowChart },
    { id: 'leaderboard', label: 'Leaderboard', icon: Leaderboard },
    { id: 'events', label: 'Events', icon: Notifications },
    { id: 'profile', label: 'Profile', icon: Person },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <Slide direction="right" in={true} mountOnEnter unmountOnExit>
      <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <Fade in={!collapsed} timeout={300}>
            <div className="logo">StockSim</div>
          </Fade>
          <Tooltip title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}>
            <IconButton 
              onClick={onToggle}
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                '&:hover': {
                  color: '#00d4ff',
                  transform: 'rotate(180deg)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
          </Tooltip>
        </div>

        <List className="nav-menu">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <Slide 
                key={item.id} 
                direction="right" 
                in={true} 
                timeout={300 + index * 100}
                mountOnEnter 
                unmountOnExit
              >
                <ListItem
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => onSectionChange(item.id)}
                  sx={{
                    opacity: collapsed && !isActive ? 0.7 : 1,
                    cursor: 'pointer',
                    '&:hover': {
                      '& .nav-icon': {
                        transform: 'scale(1.2) rotate(5deg)',
                      }
                    }
                  }}
                >
                  <Tooltip 
                    title={collapsed ? item.label : ""} 
                    placement="right"
                    disableHoverListener={!collapsed}
                  >
                    <ListItemIcon className="nav-icon">
                      <IconComponent 
                        sx={{ 
                          color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                          transition: 'all 0.3s ease'
                        }} 
                      />
                    </ListItemIcon>
                  </Tooltip>
                  
                  {!collapsed && (
                    <Fade in={!collapsed} timeout={300}>
                      <ListItemText 
                        primary={item.label}
                        sx={{
                          '& .MuiListItemText-primary': {
                            fontWeight: isActive ? 600 : 400,
                            color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                            transition: 'all 0.3s ease'
                          }
                        }}
                      />
                    </Fade>
                  )}
                </ListItem>
              </Slide>
            );
          })}
      </List>
      </div>
    </Slide>
  );
};

export default Sidebar;