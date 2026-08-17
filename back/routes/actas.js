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
    let { numero_acta, nombre_acta, fecha_acta, observaciones } = req.body;
    
    // Limpiar strings
    numero_acta = numero_acta ? String(numero_acta).trim() : undefined;
    nombre_acta = nombre_acta ? String(nombre_acta).trim() : undefined;
    fecha_acta = fecha_acta ? String(fecha_acta).trim() : undefined;
    observaciones = observaciones ? String(observaciones).trim() : undefined;
    
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
      // Si se subió archivo pero no existe el acta, eliminar archivo
      if (req.file) {
        const filePath = path.join(uploadDir, req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      return res.status(404).json({
        success: false,
        message: 'Acta no encontrada'
      });
    }

    let archivoAnterior = null;

    // Si hay archivo nuevo, guardar el anterior para eliminarlo después (en caso de éxito)
    if (req.file && actasActuales[0].archivo_pdf) {
      archivoAnterior = actasActuales[0].archivo_pdf;
    }

    // Construir dinámicamente el UPDATE con los campos que cambien
    const updateData = [];
    const updateParams = [];

    if (numero_acta && numero_acta !== actasActuales[0].numero_acta) {
      updateData.push('numero_acta = ?');
      updateParams.push(numero_acta);
    }
    if (nombre_acta && nombre_acta !== actasActuales[0].nombre_acta) {
      updateData.push('nombre_acta = ?');
      updateParams.push(nombre_acta);
    }
    if (fecha_acta && fecha_acta !== actasActuales[0].fecha_acta) {
      updateData.push('fecha_acta = ?');
      updateParams.push(fecha_acta);
    }
    if (observaciones && observaciones !== actasActuales[0].observaciones) {
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
      `UPDATE actas SET ${updateData.join(', ')} WHERE id = ?`,
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
        message: 'Error al actualizar el acta'
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
      message: 'Acta actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error en PUT /actas/:id', error);
    
    // Si hay error, eliminar archivo subido si existe
    if (req.file) {
      const filePath = path.join(uploadDir, req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

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
