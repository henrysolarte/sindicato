import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Script para inicializar la base de datos con el esquema
export async function initializeDatabase() {
  const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  };

  let connection;

  try {
    console.log('🔄 Inicializando base de datos...');
    
    connection = await mysql.createConnection(config);

    // Verificar si las tablas existen
    const [tables] = await connection.query(`
      SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE()
    `);

    const existingTables = tables.map(t => t.TABLE_NAME);

    // Crear tabla de usuarios si no existe
    if (!existingTables.includes('usuarios')) {
      console.log('📋 Creando tabla usuarios...');
      await connection.query(`
        CREATE TABLE usuarios (
          id INT AUTO_INCREMENT PRIMARY KEY,
          nombre VARCHAR(255) NOT NULL,
          correo VARCHAR(255) UNIQUE NOT NULL,
          contrasena VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    }

    // Crear tabla de actas si no existe
    if (!existingTables.includes('actas')) {
      console.log('📋 Creando tabla actas...');
      await connection.query(`
        CREATE TABLE actas (
          id INT AUTO_INCREMENT PRIMARY KEY,
          numero_acta VARCHAR(50),
          nombre_acta VARCHAR(255),
          fecha_acta DATE,
          observaciones TEXT,
          archivo_pdf VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
    }

    // Crear tabla de comunicados si no existe
    if (!existingTables.includes('comunicados')) {
      console.log('📋 Creando tabla comunicados...');
      await connection.query(`
        CREATE TABLE comunicados (
          id INT AUTO_INCREMENT PRIMARY KEY,
          fecha DATE,
          elaboracion VARCHAR(255),
          archivo_pdf VARCHAR(255),
          observaciones TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
    }

    // Crear tabla de noticias si no existe
    if (!existingTables.includes('noticias')) {
      console.log('📋 Creando tabla noticias...');
      await connection.query(`
        CREATE TABLE noticias (
          id INT AUTO_INCREMENT PRIMARY KEY,
          titulo VARCHAR(255) NOT NULL,
          contenido TEXT NOT NULL,
          imagen VARCHAR(255),
          fecha_publicacion TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
    }

    // Crear índices
    const [indexes] = await connection.query(`
      SELECT INDEX_NAME FROM INFORMATION_SCHEMA.STATISTICS 
      WHERE TABLE_SCHEMA = DATABASE()
    `);

    const existingIndexes = indexes.map(i => i.INDEX_NAME);

    const indexesToCreate = [
      { name: 'idx_usuarios_correo', table: 'usuarios', column: 'correo' },
      { name: 'idx_actas_fecha', table: 'actas', column: 'fecha_acta' },
      { name: 'idx_comunicados_fecha', table: 'comunicados', column: 'fecha' },
      { name: 'idx_noticias_fecha', table: 'noticias', column: 'fecha_publicacion' }
    ];

    for (const idx of indexesToCreate) {
      if (!existingIndexes.includes(idx.name)) {
        console.log(`🔍 Creando índice ${idx.name}...`);
        await connection.query(`
          CREATE INDEX ${idx.name} ON ${idx.table}(${idx.column})
        `);
      }
    }

    console.log('✅ Base de datos inicializada correctamente');
    await connection.end();
    return true;

  } catch (err) {
    console.error('❌ Error inicializando base de datos:', err.message);
    if (connection) {
      await connection.end();
    }
    throw err;
  }
}
