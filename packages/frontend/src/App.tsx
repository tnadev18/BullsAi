// packages\frontend\src\App.tsx

import React from 'react';
import MarketChart from './components/MarketChart';
import './App.css'; // Keep basic App styles if needed

function App() {
  // Hardcoded parameters for the simple chart display
  const symbol = 'NSE_EQ|INE848E01016';
  const interval = 'day';
  const fromDate = '2024-01-01'; // Example start date
  const toDate = '2024-03-15';   // Example end date

  return (
    <div className="App">
      <h1>BullsAI Simple Market Chart</h1>
      {/* Removed form controls */}

      <div className="chart-container">
        <MarketChart
          // Key ensures component remounts if parameters were dynamic,
          // less critical here but good practice.
          key={`${symbol}-${interval}-${fromDate}-${toDate}`}
          symbol={symbol}
          interval={interval}
          from={fromDate}
          to={toDate}
        />
      </div>
    </div>
  );
}

export default App;