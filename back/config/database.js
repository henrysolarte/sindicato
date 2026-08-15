import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool = null;

export async function getPool() {
  if (pool) {
    return pool;
  }

  try {
    pool = mysql.createPool(config);
    
    // Probar la conexión
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    
    console.log('✓ Conexión a MySQL establecida');
    return pool;
  } catch (err) {
    console.error('Error conectando a MySQL:', err);
    throw err;
  }
}

export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('Conexión a MySQL cerrada');
  }
}
