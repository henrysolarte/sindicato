import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { getPool } from '../config/database.js';

const router = express.Router();

// Crear carpeta para almacenar archivos
const uploadDir = './uploads/comunicados';
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

// Obtener todos los comunicados
router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const connection = await pool.getConnection();

    const [comunicados] = await connection.query(
      'SELECT * FROM comunicados ORDER BY fecha DESC'
    );

    connection.release();

    res.json({
      success: true,
      data: comunicados
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener comunicados',
      error: error.message
    });
  }
});

// Obtener un comunicado por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();
    const connection = await pool.getConnection();

    const [comunicados] = await connection.query(
      'SELECT * FROM comunicados WHERE id = ?',
      [id]
    );

    connection.release();

    if (comunicados.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Comunicado no encontrado'
      });
    }

    res.json({
      success: true,
      data: comunicados[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener comunicado',
      error: error.message
    });
  }
});

// Crear un nuevo comunicado
router.post('/', upload.single('archivo'), async (req, res) => {
  try {
    const { fecha, elaboracion, observaciones } = req.body;
    const archivo_pdf = req.file ? req.file.filename : null;

    if (!fecha || !elaboracion) {
      return res.status(400).json({
        success: false,
        message: 'Fecha y elaboración son requeridos'
      });
    }

    const pool = await getPool();
    const connection = await pool.getConnection();

    const [result] = await connection.query(
      'INSERT INTO comunicados (fecha, elaboracion, archivo_pdf, observaciones) VALUES (?, ?, ?, ?)',
      [fecha, elaboracion, archivo_pdf || null, observaciones || null]
    );

    connection.release();

    res.json({
      success: true,
      message: 'Comunicado creado exitosamente',
      comunicadoId: result.insertId,
      archivo_pdf: archivo_pdf
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al crear comunicado',
      error: error.message
    });
  }
});

// Actualizar un comunicado
router.put('/:id', upload.single('archivo'), async (req, res) => {
  try {
    const { id } = req.params;
    let { fecha, elaboracion, observaciones } = req.body;
    
    // Limpiar strings
    fecha = fecha ? String(fecha).trim() : undefined;
    elaboracion = elaboracion ? String(elaboracion).trim() : undefined;
    observaciones = observaciones ? String(observaciones).trim() : undefined;
    
    const archivo_pdf = req.file ? req.file.filename : null;

    const pool = await getPool();
    const connection = await pool.getConnection();

    // Obtener el comunicado actual
    const [comunicadosActuales] = await connection.query(
      'SELECT * FROM comunicados WHERE id = ?',
      [id]
    );

    if (comunicadosActuales.length === 0) {
      connection.release();
      // Si se subió archivo pero no existe el comunicado, eliminar archivo
      if (req.file) {
        const filePath = path.join(uploadDir, req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      return res.status(404).json({
        success: false,
        message: 'Comunicado no encontrado'
      });
    }

    let archivoAnterior = null;

    // Si hay archivo nuevo, guardar el anterior para eliminarlo después (en caso de éxito)
    if (req.file && comunicadosActuales[0].archivo_pdf) {
      archivoAnterior = comunicadosActuales[0].archivo_pdf;
    }

    const updateData = [];
    const updateParams = [];

    // Construir dinámicamente el UPDATE con los campos que cambien
    if (fecha && fecha !== comunicadosActuales[0].fecha) {
      updateData.push('fecha = ?');
      updateParams.push(fecha);
    }
    if (elaboracion && elaboracion !== comunicadosActuales[0].elaboracion) {
      updateData.push('elaboracion = ?');
      updateParams.push(elaboracion);
    }
    if (observaciones && observaciones !== comunicadosActuales[0].observaciones) {
      updateData.push('observaciones = ?');
      updateParams.push(observaciones);
    }
    if (archivo_pdf) {
      updateData.push('archivo_pdf = ?');
      updateParams.push(archivo_pdf);
    }

    // Siempre actualizar updated_at
    updateData.push('updated_at = NOW()');

    updateParams.push(id);

    const [result] = await connection.query(
      `UPDATE comunicados SET ${updateData.join(', ')} WHERE id = ?`,
      updateParams
    );

    connection.release();

    if (result.affectedRows === 0) {
      // Si la BD falla pero subimos archivo, eliminar archivo
      if (req.file) {
        const filePath = path.join(uploadDir, req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      return res.status(404).json({
        success: false,
        message: 'Comunicado no encontrado'
      });
    }

    // Solo eliminar archivo anterior si el UPDATE fue exitoso y había archivo nuevo
    if (archivoAnterior) {
      const filePath = path.join(uploadDir, archivoAnterior);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.json({
      success: true,
      message: 'Comunicado actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error en PUT /comunicados/:id', error);
    
    // Si hay error, eliminar archivo subido si existe
    if (req.file) {
      const filePath = path.join(uploadDir, req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Error al actualizar comunicado',
      error: error.message
    });
  }
});

// Eliminar un comunicado
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();
    const connection = await pool.getConnection();

    const [result] = await connection.query(
      'DELETE FROM comunicados WHERE id = ?',
      [id]
    );

    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Comunicado no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Comunicado eliminado exitosamente'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar comunicado',
      error: error.message
    });
  }
});

export default router;
