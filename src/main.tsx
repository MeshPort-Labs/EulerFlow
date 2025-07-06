import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { WagmiProviderWrapper } from './providers/WagmiProvider.tsx';
import { Toaster } from 'sonner'; 
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProviderWrapper>
      <App />
      <Toaster 
        position="bottom-right" 
        richColors 
        closeButton
        toastOptions={{
          duration: 5000,
          style: {
            fontSize: '14px',
          }
        }}
      />
    </WagmiProviderWrapper>
  </React.StrictMode>,
);