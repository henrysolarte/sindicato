import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import RegistroUsuario from './components/RegistroUsuario.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RegistroUsuario />
  </StrictMode>,
);
