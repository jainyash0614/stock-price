import { useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';
import { Button } from '@mui/material';
import TradeModal from './TradeModal';

Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const TIME_FRAMES = [
  { label: '1m', value: 1 },
  { label: '5m', value: 5 },
  { label: 'All', value: 'all' },
];

// Stock mapping for demo - in a real app, this would come from an API
const STOCK_MAPPING = {
  'AAPL': { id: 1, name: 'Apple Inc.' },
  'GOOG': { id: 2, name: 'Alphabet Inc.' },
  'TSLA': { id: 3, name: 'Tesla Inc.' },
  'AMZN': { id: 4, name: 'Amazon.com Inc.' },
  'MSFT': { id: 5, name: 'Microsoft Corp.' },
  'META': { id: 6, name: 'Meta Platforms' },
  'NVDA': { id: 7, name: 'NVIDIA Corp.' },
  'NFLX': { id: 8, name: 'Netflix Inc.' },
  'LYFT': { id: 9, name: 'Lyft Inc.' },
  'ABNB': { id: 10, name: 'Airbnb Inc.' },
  'ZM': { id: 11, name: 'Zoom Video' },
  'DIS': { id: 12, name: 'Walt Disney Co.' },
  'DASH': { id: 13, name: 'DoorDash Inc.' },
  'SNOW': { id: 14, name: 'Snowflake Inc.' },
  'COIN': { id: 15, name: 'Coinbase Global' },
  'PLTR': { id: 16, name: 'Palantir Technologies' },
  'PINS': { id: 17, name: 'Pinterest Inc.' },
  'SPOT': { id: 18, name: 'Spotify Technology' },
  'UBER': { id: 19, name: 'Uber Technologies' },
  'BABA': { id: 20, name: 'Alibaba Group' }
};

export default function LivePriceChart({ history, token }) {
  const [selected, setSelected] = useState('AAPL');
  const [timeFrame, setTimeFrame] = useState(5);
  const [tradeOpen, setTradeOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);

  // Add error handling for missing history prop
  if (!history) {
    return (
      <div className="card" style={{ maxWidth: 700 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8, gap: 16 }}>
          <h2 style={{ flex: 1 }}>Live Price Chart</h2>
        </div>
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          Loading price data...
        </div>
      </div>
    );
  }

  // Get available stock symbols
  const stockSymbols = useMemo(() => {
    if (!history || Object.keys(history).length === 0) {
      return ['AAPL', 'GOOG', 'TSLA', 'AMZN', 'MSFT'];
    }
    return Object.keys(history);
  }, [history]);

  // Filter points by selected time frame
  const points = useMemo(() => {
    if (!history || !history[selected]) {
      return [];
    }
    const allPoints = history[selected] || [];
    
    // Ensure allPoints is an array
    if (!Array.isArray(allPoints)) {
      console.warn('History data is not an array for symbol:', selected, allPoints);
      return [];
    }
    
    if (timeFrame === 'all') return allPoints;
    const now = Date.now();
    // Show only points within the last N minutes
    return allPoints.filter(
      p => now - new Date(p.time).getTime() <= timeFrame * 60 * 1000
    );
  }, [history, selected, timeFrame]);

  const data = useMemo(() => {
    // Ensure points is an array before mapping
    if (!Array.isArray(points)) {
      console.warn('Points is not an array:', points);
      return {
        labels: [],
        datasets: [{
          label: selected,
          data: [],
          borderColor: '#06b6d4',
          backgroundColor: 'rgba(6,182,212,0.2)',
          tension: 0.4,
        }]
      };
    }
    
    return {
      labels: points.map(p => new Date(p.time).toLocaleTimeString()),
      datasets: [
        {
          label: selected,
          data: points.map(p => p.price),
          borderColor: '#06b6d4',
          backgroundColor: 'rgba(6,182,212,0.2)',
          tension: 0.4,
        },
      ],
    };
  }, [points, selected]);

  const handleTradeClick = () => {
    // Create a stock object with the current price and proper ID
    const currentPrice = points.length > 0 ? points[points.length - 1].price : 0;
    const stockInfo = STOCK_MAPPING[selected];
    
    if (!stockInfo) {
      console.error('Stock not found in mapping:', selected);
      return;
    }
    
    const stock = {
      id: stockInfo.id,
      symbol: selected,
      name: stockInfo.name,
      price: currentPrice
    };
    setSelectedStock(stock);
    setTradeOpen(true);
  };

  return (
    <div className="card" style={{ maxWidth: 700 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8, gap: 16 }}>
        <h2 style={{ flex: 1 }}>Live Price Chart</h2>
        <select value={selected} onChange={e => setSelected(e.target.value)}>
          {stockSymbols.map(sym => (
            <option key={sym} value={sym}>{sym}</option>
          ))}
        </select>
        {TIME_FRAMES.map(tf => (
          <button
            key={tf.label}
            style={{
              marginLeft: 8,
              padding: '4px 12px',
              borderRadius: 8,
              border: 'none',
              background: timeFrame === tf.value ? '#06b6d4' : '#23232a',
              color: timeFrame === tf.value ? '#fff' : '#06b6d4',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            onClick={() => setTimeFrame(tf.value)}
          >
            {tf.label}
          </button>
        ))}
      </div>
      <Line data={data} />
      <Button
        variant="contained"
        color="primary"
        onClick={handleTradeClick}
        style={{ marginTop: 16 }}
      >
        Trade
      </Button>
      
      <TradeModal
        open={tradeOpen}
        onClose={() => setTradeOpen(false)}
        stock={selectedStock}
        token={token}
      />
    </div>
  );
}
