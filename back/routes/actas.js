import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { getPool } from '../config/database.js';

const router = express.Router();

// Crear carpeta para almacenar archivos
const uploadDir = './uploads/actas';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurar multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${timestamp}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos PDF'), false);
    }
  }
});

// Obtener todas las actas
router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const connection = await pool.getConnection();

    const [actas] = await connection.query(
      'SELECT * FROM actas ORDER BY fecha_acta DESC'
    );

    connection.release();

    res.json({
      success: true,
      data: actas
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener actas',
      error: error.message
    });
  }
});

// Obtener un acta por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();
    const connection = await pool.getConnection();

    const [actas] = await connection.query(
      'SELECT * FROM actas WHERE id = ?',
      [id]
    );

    connection.release();

    if (actas.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Acta no encontrada'
      });
    }

    res.json({
      success: true,
      data: actas[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener acta',
      error: error.message
    });
  }
});

// Crear un nuevo acta
router.post('/', upload.single('archivo'), async (req, res) => {
  try {
    const { numero_acta, nombre_acta, fecha_acta, observaciones } = req.body;
    const archivo_pdf = req.file ? req.file.filename : null;

    if (!numero_acta || !fecha_acta) {
      return res.status(400).json({
        success: false,
        message: 'Número de acta y fecha son requeridos'
      });
    }

    const pool = await getPool();
    const connection = await pool.getConnection();

    const [result] = await connection.query(
      'INSERT INTO actas (numero_acta, nombre_acta, fecha_acta, observaciones, archivo_pdf) VALUES (?, ?, ?, ?, ?)',
      [numero_acta, nombre_acta || null, fecha_acta, observaciones || null, archivo_pdf]
    );

    connection.release();

    res.json({
      success: true,
      message: 'Acta creada exitosamente',
      actaId: result.insertId,
      archivo_pdf: archivo_pdf
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al crear acta',
      error: error.message
    });
  }
});

// Actualizar un acta
router.put('/:id', upload.single('archivo'), async (req, res) => {
  try {
    const { id } = req.params;
    const { numero_acta, nombre_acta, fecha_acta, observaciones } = req.body;
    const archivo_pdf = req.file ? req.file.filename : null;

    const pool = await getPool();
    const connection = await pool.getConnection();

    // Obtener el acta actual
    const [actasActuales] = await connection.query(
      'SELECT * FROM actas WHERE id = ?',
      [id]
    );

    if (actasActuales.length === 0) {
      connection.release();
      return res.status(404).json({
        success: false,
        message: 'Acta no encontrada'
      });
    }

    // Si hay archivo nuevo, eliminar el anterior
    if (req.file && actasActuales[0].archivo_pdf) {
      const archivoAnterior = path.join(uploadDir, actasActuales[0].archivo_pdf);
      if (fs.existsSync(archivoAnterior)) {
        fs.unlinkSync(archivoAnterior);
      }
    }

    // Construir dinámicamente el UPDATE con los campos que se envíen
    const updateData = [];
    const updateParams = [];

    if (numero_acta !== undefined) {
      updateData.push('numero_acta = ?');
      updateParams.push(numero_acta);
    }
    if (nombre_acta !== undefined) {
      updateData.push('nombre_acta = ?');
      updateParams.push(nombre_acta || null);
    }
    if (fecha_acta !== undefined) {
      updateData.push('fecha_acta = ?');
      updateParams.push(fecha_acta);
    }
    if (observaciones !== undefined) {
      updateData.push('observaciones = ?');
      updateParams.push(observaciones || null);
    }
    if (req.file) {
      updateData.push('archivo_pdf = ?');
      updateParams.push(archivo_pdf);
    }

    // Siempre actualizar updated_at
    updateData.push('updated_at = NOW()');

    if (updateData.length === 1) { // Solo tiene updated_at
      connection.release();
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar al menos un campo para actualizar'
      });
    }

    updateParams.push(id);

    const [result] = await connection.query(
      `UPDATE actas SET ${updateData.join(', ')} WHERE id = ?`,
      updateParams
    );

    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Error al actualizar el acta'
      });
    }

    res.json({
      success: true,
      message: 'Acta actualizada exitosamente'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar acta',
      error: error.message
    });
  }
});

// Eliminar un acta
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();
    const connection = await pool.getConnection();

    // Obtener el archivo asociado
    const [actas] = await connection.query(
      'SELECT archivo_pdf FROM actas WHERE id = ?',
      [id]
    );

    // Eliminar el archivo del sistema de archivos
    if (actas[0] && actas[0].archivo_pdf) {
      const archivoEliminar = path.join(uploadDir, actas[0].archivo_pdf);
      if (fs.existsSync(archivoEliminar)) {
        fs.unlinkSync(archivoEliminar);
      }
    }

    // Eliminar de la BD
    const [result] = await connection.query(
      'DELETE FROM actas WHERE id = ?',
      [id]
    );

    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Acta no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Acta eliminada exitosamente'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar acta',
      error: error.message
    });
  }
});

export default router;
