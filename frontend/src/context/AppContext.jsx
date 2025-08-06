import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const { token } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [events, setEvents] = useState([]);
  const [livePrices, setLivePrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to trigger a refresh of all data
  const refreshAllData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Function to refresh specific data
  const refreshPortfolio = () => {
    fetchPortfolio();
  };

  const refreshTransactions = () => {
    fetchTransactions();
  };

  const refreshUser = () => {
    fetchUser();
  };

  const refreshLeaderboard = () => {
    fetchLeaderboard();
  };

  // Fetch user data
  const fetchUser = async () => {
    if (!token) return;
    
    try {
      const response = await fetch('http://localhost:4000/api/user/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch user info');
      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      console.error('Error fetching user info:', err);
      setError(err.message);
    }
  };

  // Fetch portfolio data
  const fetchPortfolio = async () => {
    if (!token) return;
    
    try {
      const response = await fetch('http://localhost:4000/api/user/portfolio', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch portfolio');
      const portfolioData = await response.json();
      setPortfolio(portfolioData);
    } catch (err) {
      console.error('Error fetching portfolio:', err);
      setError(err.message);
    }
  };

  // Fetch transactions
  const fetchTransactions = async () => {
    if (!token) return;
    
    try {
      const response = await fetch('http://localhost:4000/api/transactions/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const transactionsData = await response.json();
      setTransactions(transactionsData || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err.message);
    }
  };

  // Fetch leaderboard
  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/leaderboard');
      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      const leaderboardData = await response.json();
      setLeaderboard(leaderboardData || []);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError(err.message);
    }
  };

  // Fetch market events
  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/market-events/history');
      if (!response.ok) throw new Error('Failed to fetch events');
      const eventsData = await response.json();
      setEvents(eventsData || []);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.message);
    }
  };

  // Socket.IO connection for real-time updates
  useEffect(() => {
    if (!token) return;

    const socket = io('http://localhost:4000');

    socket.on('connect', () => {
      console.log('Socket.IO connected for real-time updates');
    });

    socket.on('stockPrices', (stocks) => {
      console.log('Real-time stock prices received:', stocks);
      setLivePrices(prev => {
        const next = { ...prev };
        const now = new Date();
        if (Array.isArray(stocks)) {
          stocks.forEach(stock => {
            if (!next[stock.symbol]) next[stock.symbol] = [];
            next[stock.symbol] = [
              ...next[stock.symbol],
              { time: now, price: stock.price }
            ].slice(-30); // keep last 30 points for charts
          });
        }
        return next;
      });
    });

    socket.on('marketEvent', (event) => {
      console.log('Real-time market event received:', event);
      // Refresh events when new market event occurs
      fetchEvents();
    });

    socket.on('leaderboard', (data) => {
      console.log('Real-time leaderboard update received:', data);
      setLeaderboard(data || []);
    });

    socket.on('portfolioUpdate', (data) => {
      console.log('Real-time portfolio update received:', data);
      if (data.portfolio) {
        setPortfolio(data.portfolio);
      }
      if (data.user) {
        setUser(data.user);
      }
    });

    socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
    });

    socket.on('disconnect', () => {
      console.log('Socket.IO disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  // Initial data fetch and refresh on trigger
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const fetchAllData = async () => {
      try {
        await Promise.all([
          fetchUser(),
          fetchPortfolio(),
          fetchTransactions(),
          fetchLeaderboard(),
          fetchEvents()
        ]);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching initial data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAllData();
  }, [token, refreshTrigger]);

  const value = {
    // State
    portfolio,
    user,
    transactions,
    leaderboard,
    events,
    livePrices,
    loading,
    error,
    
    // Actions
    refreshAllData,
    refreshPortfolio,
    refreshTransactions,
    refreshUser,
    refreshLeaderboard,
    
    // Setters for immediate updates
    setPortfolio,
    setUser,
    setTransactions,
    setLeaderboard,
    setEvents,
    setLivePrices
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}; 