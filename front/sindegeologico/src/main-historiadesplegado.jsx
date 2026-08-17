import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import HistoriaDesplegado from './components/historiadesplegado.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HistoriaDesplegado />
  </StrictMode>,
);
