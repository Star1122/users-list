import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import { FavoriteProvider } from './contexts/AppContext';

import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <FavoriteProvider>
      <App />
    </FavoriteProvider>
  </React.StrictMode>,
);
