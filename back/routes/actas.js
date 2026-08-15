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

    // Si hay archivo nuevo, obtener el anterior para eliminarlo
    if (req.file) {
      const [actas] = await connection.query(
        'SELECT archivo_pdf FROM actas WHERE id = ?',
        [id]
      );

      if (actas[0] && actas[0].archivo_pdf) {
        const archivoAnterior = path.join(uploadDir, actas[0].archivo_pdf);
        if (fs.existsSync(archivoAnterior)) {
          fs.unlinkSync(archivoAnterior);
        }
      }
    }

    // Si no hay archivo nuevo, mantener el anterior
    let archivoFinal = archivo_pdf;
    if (!req.file) {
      const [actas] = await connection.query(
        'SELECT archivo_pdf FROM actas WHERE id = ?',
        [id]
      );
      archivoFinal = actas[0]?.archivo_pdf || null;
    }

    const [result] = await connection.query(
      'UPDATE actas SET numero_acta = ?, nombre_acta = ?, fecha_acta = ?, observaciones = ?, archivo_pdf = ? WHERE id = ?',
      [numero_acta, nombre_acta || null, fecha_acta, observaciones || null, archivoFinal, id]
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
      message: 'Acta actualizada exitosamente',
      archivo_pdf: archivoFinal
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
