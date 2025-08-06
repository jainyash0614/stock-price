# Stock Market Simulation Game

A full-stack, real-time, gamified stock market simulator. Compete with others, manage your portfolio, and experience dynamic market events in a modern web app!

---

## 🚀 Features
- **Real-time Stock Prices** with live charts
- **Buy/Sell Stocks** and manage your portfolio
- **Market Events**: Crashes, surges, IPOs, news, sector rotations
- **Leaderboard**: Compete for the top spot
- **Transaction History**: Track all your trades
- **Authentication**: Secure login/register
- **Dark/Light Mode**: Beautiful, theme-aware UI
- **Responsive Design**: Works on desktop and mobile

---

## 🛠️ Tech Stack
- **Frontend**: React 19, Material-UI, Chart.js, Socket.IO Client, Vite
- **Backend**: Node.js, Express, Prisma ORM, PostgreSQL, Socket.IO
- **Authentication**: JWT, bcrypt

---

## 📸 Screenshots
> _Add screenshots/gifs here to showcase the dashboard, trading, leaderboard, and events._

---

## 🏗️ Architecture Overview
- **Backend**: REST API + Socket.IO for real-time updates
- **Frontend**: SPA with React Router, Context API for global state
- **Database**: PostgreSQL with Prisma schema for users, stocks, portfolios, transactions, events, leaderboard

---

## ⚡ Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd stock-price
```

### 2. Backend Setup
```bash
cd backend
npm install
# Configure your .env with DATABASE_URL for PostgreSQL
npx prisma migrate dev
npm start
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

- Backend runs on `http://localhost:4000`
- Frontend runs on `http://localhost:5173`

---

## 🧭 Usage
- Register or log in
- Explore the dashboard for live prices, events, and leaderboard
- Buy/sell stocks from your portfolio or charts
- Watch your rank change in real time!

---

## 📂 Project Structure
```
stock-price/
├── backend/
│   ├── controllers/      # API logic
│   ├── routes/           # API endpoints
│   ├── services/         # Simulation, leaderboard, etc.
│   ├── prisma/           # Database schema
│   └── index.js          # Server entry
├── frontend/
│   ├── src/
│   │   ├── components/   # React UI components
│   │   ├── context/      # Global state
│   │   ├── hooks/        # Custom hooks
│   │   └── App.jsx       # Main app
│   └── public/
└── README.md
```

---

## 🧠 Key Concepts
- **Geometric Brownian Motion** for realistic price simulation
- **Event-driven market**: Random events impact prices
- **Socket.IO** for instant updates (prices, events, leaderboard)
- **Prisma ORM** for type-safe DB access
- **Material-UI** for modern, themeable UI

---

## 🤝 Contributing
Pull requests welcome! For major changes, open an issue first to discuss what you’d like to change.

---

## 📄 License
[MIT](LICENSE)
