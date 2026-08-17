import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { getPool } from '../config/database.js';

const router = express.Router();

// Crear carpeta para almacenar archivos
const uploadDir = './uploads/noticias';
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
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen (JPG, PNG, GIF, WEBP)'), false);
    }
  }
});

// Obtener todas las noticias
router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const connection = await pool.getConnection();

    const [noticias] = await connection.query(
      'SELECT * FROM noticias ORDER BY created_at DESC, id DESC'
    );

    connection.release();

    res.json({
      success: true,
      data: noticias
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener noticias',
      error: error.message
    });
  }
});

// Obtener una noticia por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();
    const connection = await pool.getConnection();

    const [noticias] = await connection.query(
      'SELECT * FROM noticias WHERE id = ?',
      [id]
    );

    connection.release();

    if (noticias.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Noticia no encontrada'
      });
    }

    res.json({
      success: true,
      data: noticias[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener noticia',
      error: error.message
    });
  }
});

// Crear una nueva noticia
router.post('/', upload.single('imagen'), async (req, res) => {
  try {
    const { titulo, contenido } = req.body;
    const imagen = req.file ? req.file.filename : null;

    if (!titulo || !contenido) {
      return res.status(400).json({
        success: false,
        message: 'Título y contenido son requeridos'
      });
    }

    const pool = await getPool();
    const connection = await pool.getConnection();

    const [result] = await connection.query(
      'INSERT INTO noticias (titulo, contenido, imagen, fecha_publicacion) VALUES (?, ?, ?, NOW())',
      [titulo, contenido, imagen || null]
    );

    connection.release();

    res.json({
      success: true,
      message: 'Noticia creada exitosamente',
      noticiaId: result.insertId,
      imagen: imagen
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al crear noticia',
      error: error.message
    });
  }
});

// Actualizar una noticia
router.put('/:id', upload.single('imagen'), async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, contenido } = req.body;
    const imagen = req.file ? req.file.filename : null;

    // Validar que al menos uno de estos campos exista
    if (!titulo && !contenido && !imagen) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar al menos un campo para actualizar'
      });
    }

    const pool = await getPool();
    const connection = await pool.getConnection();

    // Verificar que la noticia existe
    const [noticiaActual] = await connection.query(
      'SELECT * FROM noticias WHERE id = ?',
      [id]
    );

    if (noticiaActual.length === 0) {
      connection.release();
      return res.status(404).json({
        success: false,
        message: 'Noticia no encontrada'
      });
    }

    // Si hay imagen nueva, eliminar la anterior
    if (req.file && noticiaActual[0].imagen) {
      const filePath = path.join(uploadDir, noticiaActual[0].imagen);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    const updateData = [];
    const updateParams = [];

    // Construir dinámicamente el UPDATE
    if (titulo) {
      updateData.push('titulo = ?');
      updateParams.push(titulo);
    }
    if (contenido) {
      updateData.push('contenido = ?');
      updateParams.push(contenido);
    }
    if (req.file) {
      updateData.push('imagen = ?');
      updateParams.push(imagen);
    }
    
    // Siempre actualizar updated_at
    updateData.push('updated_at = NOW()');

    updateParams.push(id);

    const [result] = await connection.query(
      `UPDATE noticias SET ${updateData.join(', ')} WHERE id = ?`,
      updateParams
    );

    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Error al actualizar la noticia'
      });
    }

    res.json({
      success: true,
      message: 'Noticia actualizada exitosamente'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar noticia',
      error: error.message
    });
  }
});

// Eliminar una noticia
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();
    const connection = await pool.getConnection();

    const [result] = await connection.query(
      'DELETE FROM noticias WHERE id = ?',
      [id]
    );

    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Noticia no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Noticia eliminada exitosamente'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar noticia',
      error: error.message
    });
  }
});

export default router;
