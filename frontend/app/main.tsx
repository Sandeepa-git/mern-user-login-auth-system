import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './routes/dashboard/App'; // ✅ import App from inside dashboard folder
import './index.css'; // Tailwind/global styles

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
