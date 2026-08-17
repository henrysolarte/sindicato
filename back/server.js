import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getPool, closePool } from './config/database.js';
import { initializeDatabase } from './config/initialize-db.js';
import usuariosRouter from './routes/usuarios.js';
import noticiasRouter from './routes/noticias.js';
import comunicadosRouter from './routes/comunicados.js';
import actasRouter from './routes/actas.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Crear carpeta para almacenar archivos
const uploadDir = './uploads/actas';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Ruta de prueba de conexión
app.get('/api/test-connection', async (req, res) => {
  try {
    const pool = await getPool();
    const connection = await pool.getConnection();
    const result = await connection.query('SELECT 1 as conexion');
    connection.release();
    
    res.json({
      success: true,
      message: 'Conexión a MySQL exitosa',
      data: result[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error en conexión a MySQL',
      error: err.message
    });
  }
});

// Ruta de prueba de API
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API está funcionando correctamente'
  });
});

// Rutas de la API
app.use('/api/usuarios', usuariosRouter);
app.use('/api/noticias', noticiasRouter);
app.use('/api/comunicados', comunicadosRouter);
app.use('/api/actas', actasRouter);

// --- CONFIGURACIÓN PARA SERVIR EL FRONTEND ---
const frontendBuildPath = path.join(__dirname, '../front/sindegeologico/dist');
app.use(express.static(frontendBuildPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

// Iniciar servidor
async function startServer() {
  try {
    // Inicializar base de datos
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`✓ Servidor ejecutándose en puerto: ${PORT}`);
      console.log(`✓ Prueba la conexión en: /api/test-connection`);
    });
  } catch (err) {
    console.error('❌ Error al iniciar servidor:', err.message);
    process.exit(1);
  }
}

startServer();

// Cerrar conexión al terminar
process.on('SIGINT', async () => {
  console.log('\nCerrando servidor...');
  await closePool();
  process.exit(0);
});