import { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';

export default function TradeModal({ open, onClose, stock, token }) {
  const [quantity, setQuantity] = useState(1);
  const [type, setType] = useState('buy');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!stock) return null;

  const handleTrade = async () => {
    if (quantity <= 0) {
      setError('Quantity must be greater than 0');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`http://localhost:4000/api/portfolio/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          stockId: stock.id,
          quantity: parseInt(quantity),
          price: stock.price
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(`${type === 'buy' ? 'Bought' : 'Sold'} ${quantity} shares of ${stock.symbol} successfully!`);
        setTimeout(() => {
          onClose();
          setSuccess('');
          setQuantity(1);
        }, 2000);
      } else {
        setError(data.message || 'Trade failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalCost = quantity * stock.price;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
      }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Trade {stock.symbol}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Current Price: ${stock.price}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <TextField
          select
          fullWidth
          label="Trade Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          sx={{ mb: 2 }}
        >
          <MenuItem value="buy">Buy</MenuItem>
          <MenuItem value="sell">Sell</MenuItem>
        </TextField>

        <TextField
          fullWidth
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
          sx={{ mb: 2 }}
          inputProps={{ min: 1 }}
        />

        <Typography variant="body1" sx={{ mb: 2 }}>
          Total: ${totalCost.toLocaleString()}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
        <Button
          variant="contained"
          onClick={handleTrade}
          disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
        >
            {loading ? 'Processing...' : `${type === 'buy' ? 'Buy' : 'Sell'}`}
        </Button>
        </Box>
      </Box>
    </Modal>
  );
}
