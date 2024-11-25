import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialize theme from localStorage before rendering
const savedTheme = localStorage.getItem('evike-service-store');
if (savedTheme) {
  const settings = JSON.parse(savedTheme).state.settings;
  if (settings?.theme === 'dark') {
    document.documentElement.classList.add('dark');
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);