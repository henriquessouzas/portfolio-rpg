import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/styles.css';
import App from './App';
import DesignPage from './design/DesignPage';

const isDesign = window.location.pathname === '/design';

const root = document.getElementById('root');
if (!root) throw new Error('Elemento #root não encontrado');
createRoot(root).render(
  <StrictMode>
    {isDesign ? <DesignPage /> : <App />}
  </StrictMode>,
);
