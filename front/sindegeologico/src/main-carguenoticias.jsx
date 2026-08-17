import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import CargudeNoticias from './components/CargudeNoticias.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CargudeNoticias />
  </StrictMode>,
);
