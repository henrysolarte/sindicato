import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import FormularioComunicados from './components/FormularioComunicados.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FormularioComunicados />
  </StrictMode>,
);
