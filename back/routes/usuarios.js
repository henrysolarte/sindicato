import express from 'express';
import { getPool } from '../config/database.js';

const router = express.Router();

// Registro de usuario
router.post('/registro', async (req, res) => {
  try {
    const { nombre, correo, contrasena } = req.body;

    if (!nombre || !correo || !contrasena) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    const pool = await getPool();
    const connection = await pool.getConnection();

    // Verificar si el correo ya existe
    const [usuarioExistente] = await connection.query(
      'SELECT id FROM usuarios WHERE correo = ?',
      [correo]
    );

    if (usuarioExistente.length > 0) {
      connection.release();
      return res.status(400).json({
        success: false,
        message: 'El correo ya está registrado'
      });
    }

    // Insertar nuevo usuario
    const [result] = await connection.query(
      'INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)',
      [nombre, correo, contrasena]
    );

    connection.release();

    res.json({
      success: true,
      message: 'Usuario registrado exitosamente',
      usuarioId: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario',
      error: error.message
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    const pool = await getPool();
    const connection = await pool.getConnection();

    const [usuarios] = await connection.query(
      'SELECT id, nombre, correo FROM usuarios WHERE correo = ? AND contrasena = ?',
      [correo, contrasena]
    );

    connection.release();

    if (usuarios.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Correo o contraseña incorrectos'
      });
    }

    res.json({
      success: true,
      message: 'Login exitoso',
      usuario: usuarios[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error en login',
      error: error.message
    });
  }
});

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const connection = await pool.getConnection();

    const [usuarios] = await connection.query(
      'SELECT id, nombre, correo, created_at FROM usuarios'
    );

    connection.release();

    res.json({
      success: true,
      data: usuarios
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios',
      error: error.message
    });
  }
});

export default router;
