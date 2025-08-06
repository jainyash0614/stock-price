import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, Box, Chip, Fade, Slide, Grow, Paper, IconButton, Tooltip
} from '@mui/material';
import { TrendingUp, TrendingDown, Visibility, VisibilityOff, FilterList, Sort } from '@mui/icons-material';
import useTransactions from '../hooks/useTransactions';

const formatValue = (value) => {
  if (typeof value === 'number') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }
  return value;
};

const formatDate = (dateStr) => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch (error) {
    return 'N/A';
  }
};

const TransactionHistory = ({ token }) => {
  const { transactions, loading, error } = useTransactions(token);
  const [animatedRows, setAnimatedRows] = useState(new Set());

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      // Animate new rows
      const newRows = new Set();
      transactions.slice(0, 10).forEach((transaction, index) => {
        setTimeout(() => {
          newRows.add(transaction.id);
          setAnimatedRows(new Set(newRows));
        }, index * 100);
      });
    }
  }, [transactions]);

  const getTransactionIcon = (type) => {
    return type === 'BUY' ? <TrendingUp /> : <TrendingDown />;
  };

  const getTransactionColor = (type) => {
    return type === 'BUY' ? '#00ff88' : '#ff4757';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Loading transactions...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
        <Typography variant="body2" sx={{ color: '#ff4757' }}>
          Error loading transactions: {error}
        </Typography>
      </Box>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          No transactions found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      background: 'transparent',
      borderRadius: 2,
      overflow: 'hidden'
    }}>
      <TableContainer
        component={Paper}
        sx={{
          background: 'transparent',
          boxShadow: 'none',
          maxHeight: 350,
          overflowX: 'auto',
          '& .MuiTable-root': {
            borderCollapse: 'separate',
            borderSpacing: '0 4px',
            minWidth: 900,
            tableLayout: 'fixed', // 🔥 Ensures fixed column widths
          },
          '& .MuiTableHead-root': {
            position: 'sticky',
            top: 0,
            zIndex: 10,
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
          },
          '& .MuiTableHead-root .MuiTableCell-root': {
            position: 'sticky',
            top: 0,
            zIndex: 11,
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
          }
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {['Type', 'Stock', 'Quantity', 'Price', 'Total', 'Date'].map((label, i) => (
                <TableCell
                  key={label}
                  sx={{
                    width: ['15%', '15%', '10%', '15%', '15%', '30%'][i], // 🔒 Assign exact widths
                    background: 'rgba(255,255,255,0.05)',
                    color: 'text.primary',
                    fontWeight: 600,
                    border: 'none',
                    fontSize: '0.875rem',
                    padding: '10px 12px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {transactions.slice(0, 10).map((transaction, index) => (
              <TableRow key={transaction.id} sx={{
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.05)',
                  transform: 'translateX(4px)',
                },
                '&:nth-of-type(odd)': {
                  background: 'rgba(255, 255, 255, 0.03)',
                },
                '&:nth-of-type(odd):hover': {
                  background: 'rgba(255, 255, 255, 0.06)',
                }
              }}>
                {/* Type */}
                <TableCell sx={{ width: '15%', padding: '10px 12px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: transaction.type === 'BUY' ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 71, 87, 0.2)',
                        border: `2px solid ${transaction.type === 'BUY' ? '#00ff88' : '#ff4757'}`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          background: transaction.type === 'BUY' ? 'rgba(0, 255, 136, 0.3)' : 'rgba(255, 71, 87, 0.3)',
                        }
                      }}
                    >
                      {transaction.type === 'BUY' ? (
                        <TrendingUp sx={{ color: '#00ff88', fontSize: 16 }} />
                      ) : (
                        <TrendingDown sx={{ color: '#ff4757', fontSize: 16 }} />
                      )}
                    </Box>
                    <Chip
                      label={transaction.type}
                      color={transaction.type === 'BUY' ? 'success' : 'error'}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                </TableCell>

                {/* Stock */}
                <TableCell sx={{ width: '15%', padding: '10px 12px' }}>
                  <Typography variant="body2" noWrap>
                    {transaction.stock?.symbol || 'N/A'}
                  </Typography>
                </TableCell>

                {/* Quantity */}
                <TableCell sx={{ width: '10%', padding: '10px 12px' }}>
                  <Typography variant="body2" noWrap>
                    {transaction.quantity ?? 'N/A'}
                  </Typography>
                </TableCell>

                {/* Price */}
                <TableCell sx={{ width: '15%', padding: '10px 12px' }}>
                  <Typography variant="body2" noWrap>
                    ${transaction.price?.toFixed(2) ?? 'N/A'}
                  </Typography>
                </TableCell>

                {/* Total */}
                <TableCell sx={{ width: '15%', padding: '10px 12px' }}>
                  <Typography variant="body2" noWrap>
                    ${(transaction.price * transaction.quantity).toFixed(2)}
                  </Typography>
                </TableCell>

                {/* Date */}
                <TableCell sx={{ width: '30%', padding: '10px 12px' }}>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {transaction.createdAt
                      ? new Date(transaction.createdAt).toLocaleString('en-US', {
                          month: 'short',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })
                      : 'N/A'}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TransactionHistory;
