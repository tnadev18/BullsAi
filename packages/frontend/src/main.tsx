import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { QueryClientProvider } from '@tanstack/react-query'; // Import provider
import { queryClient } from './queryClient.ts'; // Import client instance

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}> {/* Wrap App */}
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);