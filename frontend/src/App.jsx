import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import HeroPage from './components/HeroPage';
import usePortfolio from './hooks/usePortfolio';
import './index.css';

const AppContent = () => {
  const { token, user } = useAuth();
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { portfolio, user: portfolioUser, loading: portfolioLoading, error: portfolioError } = usePortfolio(token);

  // Set initial theme and handle theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#00d4ff' : '#2563eb',
        light: darkMode ? '#4ddbff' : '#3b82f6',
        dark: darkMode ? '#0099cc' : '#1d4ed8',
      },
      secondary: {
        main: darkMode ? '#ff00ff' : '#dc2626',
        light: darkMode ? '#ff4dff' : '#ef4444',
        dark: darkMode ? '#cc00cc' : '#b91c1c',
      },
      background: {
        default: darkMode ? '#0a0a0a' : '#ffffff',
        paper: darkMode ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#ffffff' : '#111827',
        secondary: darkMode ? 'rgba(255, 255, 255, 0.7)' : '#6b7280',
      },
      success: {
        main: darkMode ? '#00ff88' : '#059669',
        light: darkMode ? '#4dffaa' : '#10b981',
        dark: darkMode ? '#00cc6a' : '#047857',
      },
      error: {
        main: darkMode ? '#ff4757' : '#dc2626',
        light: darkMode ? '#ff7a85' : '#ef4444',
        dark: darkMode ? '#cc3a45' : '#b91c1c',
      },
      warning: {
        main: darkMode ? '#ffa726' : '#d97706',
        light: darkMode ? '#ffb74d' : '#f59e0b',
        dark: darkMode ? '#f57c00' : '#b45309',
      },
      info: {
        main: darkMode ? '#00d4ff' : '#0891b2',
        light: darkMode ? '#4ddbff' : '#06b6d4',
        dark: darkMode ? '#0099cc' : '#0e7490',
      },
      divider: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        color: darkMode ? '#ffffff' : '#111827',
      },
      h2: {
        fontWeight: 600,
        color: darkMode ? '#ffffff' : '#111827',
      },
      h3: {
        fontWeight: 600,
        color: darkMode ? '#ffffff' : '#111827',
      },
      h4: {
        fontWeight: 600,
        color: darkMode ? '#ffffff' : '#111827',
      },
      h5: {
        fontWeight: 600,
        color: darkMode ? '#ffffff' : '#111827',
      },
      h6: {
        fontWeight: 600,
        color: darkMode ? '#ffffff' : '#111827',
      },
      body1: {
        color: darkMode ? '#ffffff' : '#111827',
      },
      body2: {
        color: darkMode ? 'rgba(255, 255, 255, 0.7)' : '#6b7280',
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.875rem',
            padding: '8px 16px',
            transition: 'all 0.2s ease-in-out',
            boxShadow: darkMode
              ? '0 1px 3px rgba(0, 0, 0, 0.3)'
              : '0 1px 3px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: darkMode
                ? '0 4px 12px rgba(0, 0, 0, 0.4)'
                : '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
          },
          contained: {
            background: darkMode
              ? 'linear-gradient(135deg, #00d4ff, #0099cc)'
              : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            '&:hover': {
              background: darkMode
                ? 'linear-gradient(135deg, #4ddbff, #00d4ff)'
                : 'linear-gradient(135deg, #3b82f6, #2563eb)',
            },
          },
          outlined: {
            borderColor: darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)',
            '&:hover': {
              borderColor: darkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.3)',
              background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            background: darkMode ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
            backdropFilter: 'blur(10px)',
            border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.06)',
            boxShadow: darkMode
              ? '0 8px 32px rgba(0, 0, 0, 0.3)'
              : '0 4px 20px rgba(0, 0, 0, 0.08)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: darkMode
                ? '0 12px 40px rgba(0, 0, 0, 0.4)'
                : '0 8px 25px rgba(0, 0, 0, 0.12)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            background: darkMode ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
            backdropFilter: 'blur(10px)',
            border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.06)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
            borderRadius: 8,
            fontSize: '0.75rem',
            height: 24,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
            padding: '12px 16px',
          },
          head: {
            fontWeight: 600,
            color: darkMode ? '#ffffff' : '#111827',
            background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
            fontSize: '0.875rem',
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:hover': {
              background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              '& fieldset': {
                borderColor: darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)',
                borderWidth: 1,
              },
              '&:hover fieldset': {
                borderColor: darkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.3)',
              },
              '&.Mui-focused fieldset': {
                borderColor: darkMode ? '#00d4ff' : '#2563eb',
                borderWidth: 2,
              },
            },
            '& .MuiInputLabel-root': {
              color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
              '&.Mui-focused': {
                color: darkMode ? '#00d4ff' : '#2563eb',
              },
            },
            '& .MuiInputBase-input': {
              color: darkMode ? '#ffffff' : '#111827',
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            background: darkMode ? 'rgba(17, 24, 39, 0.95)' : '#ffffff',
            backdropFilter: 'blur(20px)',
            border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.06)',
            borderRadius: 16,
            boxShadow: darkMode
              ? '0 20px 60px rgba(0, 0, 0, 0.5)'
              : '0 10px 40px rgba(0, 0, 0, 0.15)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: darkMode ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
            backdropFilter: 'blur(10px)',
            borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.06)',
            boxShadow: darkMode
              ? '0 4px 20px rgba(0, 0, 0, 0.3)'
              : '0 2px 10px rgba(0, 0, 0, 0.08)',
          },
        },
      },
    },
  });

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleToggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Mock notifications for demo
  const notifications = [
    {
      id: 1,
      title: 'Market Update',
      message: 'TSLA stock surged 5% today',
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 min ago
      type: 'success',
      read: false
    },
    {
      id: 2,
      title: 'Portfolio Alert',
      message: 'Your AAPL position is up 3.2%',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 min ago
      type: 'info',
      read: false
    },
    {
      id: 3,
      title: 'Trade Executed',
      message: 'Successfully bought 10 TSLA shares',
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 min ago
      type: 'success',
      read: true
    }
  ];

  if (!token) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <HeroPage />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <DashboardLayout
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={handleToggleSidebar}
          darkMode={darkMode}
          onToggleTheme={handleToggleTheme}
          notifications={notifications}
          portfolio={portfolio}
          user={portfolioUser || user}
          token={token}
        />
      </Router>
    </ThemeProvider>
  );
};

const DashboardLayout = ({
  sidebarCollapsed,
  onToggleSidebar,
  darkMode,
  onToggleTheme,
  notifications,
  portfolio,
  user,
  token
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract the active section from the current path
  const getActiveSection = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return 'dashboard';
    return path.substring(1); // Remove the leading slash
  };

  const handleSectionChange = (section) => {
    navigate(`/${section}`);
  };

  return (
    <div className="app-container">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={onToggleSidebar}
        activeSection={getActiveSection()}
        onSectionChange={handleSectionChange}
      />

      <div className="main-content" style={{ marginLeft: sidebarCollapsed ? '70px' : '280px' }}>
        <Topbar
          darkMode={darkMode}
          onToggleTheme={onToggleTheme}
          notifications={notifications}
          onToggleSidebar={onToggleSidebar}
        />

        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={
            <Dashboard
              portfolio={portfolio}
              user={user}
              token={token}
              activeSection="dashboard"
            />
          } />
          <Route path="/portfolio" element={
            <Dashboard
              portfolio={portfolio}
              user={user}
              token={token}
              activeSection="portfolio"
            />
          } />
          <Route path="/watchlist" element={
            <Dashboard
              portfolio={portfolio}
              user={user}
              token={token}
              activeSection="watchlist"
            />
          } />
          <Route path="/charts" element={
            <Dashboard
              portfolio={portfolio}
              user={user}
              token={token}
              activeSection="charts"
            />
          } />
          <Route path="/leaderboard" element={
            <Dashboard
              portfolio={portfolio}
              user={user}
              token={token}
              activeSection="leaderboard"
            />
          } />
          <Route path="/events" element={
            <Dashboard
              portfolio={portfolio}
              user={user}
              token={token}
              activeSection="events"
            />
          } />
          <Route path="/profile" element={
            <Dashboard
              portfolio={portfolio}
              user={user}
              token={token}
              activeSection="profile"
            />
          } />
          <Route path="/settings" element={
            <Dashboard
              portfolio={portfolio}
              user={user}
              token={token}
              activeSection="settings"
            />
          } />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
};

export default App;