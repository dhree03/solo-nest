import React from 'react';
import ReactDOM from 'react-dom/client';
import SoloNestApp from './App'; // ✅ this should match
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SoloNestApp />
  </React.StrictMode>
);
