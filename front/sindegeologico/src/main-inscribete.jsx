import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import FormularioSindegeologico from './Formularios/Sindegeologico/App.jsx'
import './Formularios/Sindegeologico/index.css'

createRoot(document.getElementById('root')).render(
<StrictMode>
<FormularioSindegeologico />
</StrictMode>,
)
