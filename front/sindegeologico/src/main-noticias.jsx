import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Noticias from './components/noticias.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Noticias />
  </StrictMode>,
);
