import express from 'express';
import { getPool, sql } from '../config/database.js';

const router = express.Router();

// Ejemplo: Obtener todos los registros de una tabla
router.get('/datos', async (req, res) => {
  try {
    const pool = await getPool();
    
    // Cambiar "nombre_tabla" por la tabla que quieras consultar
    const result = await pool.request()
      .query('SELECT TOP 10 * FROM nombre_tabla');
    
    res.json({
      success: true,
      data: result.recordset
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error al obtener datos',
      error: err.message
    });
  }
});

// Ejemplo: Insertar un registro
router.post('/datos', async (req, res) => {
  try {
    const pool = await getPool();
    const { nombre, valor } = req.body;
    
    const result = await pool.request()
      .input('nombre', sql.VarChar, nombre)
      .input('valor', sql.Int, valor)
      .query('INSERT INTO nombre_tabla (nombre, valor) VALUES (@nombre, @valor)');
    
    res.json({
      success: true,
      message: 'Datos insertados correctamente',
      data: result
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error al insertar datos',
      error: err.message
    });
  }
});

export default router;
