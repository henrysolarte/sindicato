import React, { useState, useEffect } from 'react';

export default function CargudeNoticias() {
  const [usuario, setUsuario] = useState(null);
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    imagen: null
  });
  const [mensaje, setMensaje] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    // Obtener usuario del localStorage o sessionStorage
    let usuarioGuardado = localStorage.getItem('usuario');
    if (!usuarioGuardado) {
      usuarioGuardado = sessionStorage.getItem('usuario');
    }
    if (!usuarioGuardado) {
      window.location.href = '/login.html';
      return;
    }
    try {
      setUsuario(JSON.parse(usuarioGuardado));
    } catch (error) {
      window.location.href = '/login.html';
      return;
    }

    // Cargar noticias de la API
    cargarNoticias();
  }, []);

  const cargarNoticias = async () => {
    try {
      const response = await fetch('https://sindicato-w3ev.onrender.com/api/noticias');
      const data = await response.json();
      setNoticias(data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error cargando noticias:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    window.location.href = '/index.html';
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        imagen: files[0] || null
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const limpiarFormulario = () => {
    setFormData({
      titulo: '',
      contenido: '',
      imagen: null
    });
    setEditando(null);
    setMensaje('');
  };

  const abrirFormularioNuevo = () => {
    limpiarFormulario();
    setMostrarFormulario(true);
  };

  const abrirFormularioEditar = (noticia) => {
    setFormData({
      titulo: noticia.titulo || '',
      contenido: noticia.contenido || '',
      imagen: null
    });
    setEditando(noticia.id);
    setMostrarFormulario(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');

    if (!formData.titulo || !formData.contenido) {
      setMensaje('Título y contenido son requeridos');
      return;
    }

    try {
      // Siempre usar FormData para consistencia con multer
      const body = new FormData();
      body.append('titulo', formData.titulo);
      body.append('contenido', formData.contenido);
      if (formData.imagen) {
        body.append('imagen', formData.imagen);
      }

      const url = editando 
        ? `https://sindicato-w3ev.onrender.com/api/noticias/${editando}`
        : 'https://sindicato-w3ev.onrender.com/api/noticias';
      
      const method = editando ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        body: body
        // NO incluir Content-Type - el navegador lo establece automáticamente
      });

      const data = await response.json();
      
      if (data.success) {
        setMensaje(editando ? '✓ Noticia actualizada exitosamente' : '✓ Noticia creada exitosamente');
        limpiarFormulario();
        setMostrarFormulario(false);
        cargarNoticias();
        setTimeout(() => setMensaje(''), 3000);
      } else {
        setMensaje('Error: ' + data.message);
      }
    } catch (error) {
      setMensaje('Error en la conexión: ' + error.message);
    }
  };

  const eliminarNoticia = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta noticia?')) return;

    try {
      const response = await fetch(`https://sindicato-w3ev.onrender.com/api/noticias/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setMensaje('✓ Noticia eliminada exitosamente');
        cargarNoticias();
        setTimeout(() => setMensaje(''), 3000);
      } else {
        setMensaje('Error: ' + data.message);
      }
    } catch (error) {
      setMensaje('Error: ' + error.message);
    }
  };

  return (
    <>
      <header id="header" className="header d-flex flex-column">
        <div className="branding d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #069169 0%, #046a4f 100%)', padding: '15px 0', minHeight: '160px' }}>
          <div className="container-fluid d-flex align-items-center justify-content-between px-4">
            <div className="d-flex align-items-center gap-3">
              <a href="/" className="logo d-flex align-items-center text-decoration-none">
                <img src="/assets/img/logoSGC.jpg" alt="SGC Logo" style={{ height: '120px', width: 'auto', maxHeight: 'none', objectFit: 'contain' }} />
              </a>
            </div>
            <div className="d-none d-lg-block flex-grow-1 text-center px-4">
              <h2 className="mb-0" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '800', fontStyle: 'italic', fontSize: '1.7rem', color: '#ffffff', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)' }}>
                "Si estamos unidos, nadie queda atrás"
              </h2>
            </div>
            <div className="text-white d-flex align-items-center gap-3">
              <div>
                <p className="mb-2">Bienvenido: <strong>{usuario?.nombre}</strong></p>
                <div className="d-flex gap-2">
                  <a href="/menu.html" className="btn btn-sm btn-outline-light">Administrar</a>
                  <button onClick={handleLogout} className="btn btn-sm btn-outline-light">Cerrar Sesión</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="main" style={{ backgroundColor: '#e3f3f0', minHeight: '100vh', paddingTop: '40px', paddingBottom: '40px' }}>
        <section style={{ backgroundColor: '#e3f3f0' }}>
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h1 style={{ color: '#046a4f', fontWeight: 'bold', fontSize: '2.5rem' }}>
                    <i className="bi bi-newspaper"></i> Noticias
                  </h1>
                  <div className="d-flex gap-2">
                    <button onClick={abrirFormularioNuevo} className="btn" style={{ backgroundColor: '#069169', color: 'white', fontWeight: 'bold' }}>
                      <i className="bi bi-plus-circle"></i> Nueva Noticia
                    </button>
                    <a href="/menu.html" className="btn" style={{ backgroundColor: '#046a4f', color: 'white' }}>
                      Volver al Menú
                    </a>
                  </div>
                </div>

                {/* FORMULARIO COLAPSABLE */}
                {mostrarFormulario && (
                  <div className="bg-white rounded shadow-sm p-5 mb-4">
                    <h2 style={{ color: '#046a4f', fontWeight: 'bold', fontSize: '1.8rem', marginBottom: '30px' }}>
                      {editando ? 'Editar Noticia' : 'Crear Nueva Noticia'}
                    </h2>

                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label className="form-label" style={{ color: '#046a4f', fontWeight: '600' }}>Título</label>
                        <input
                          type="text"
                          className="form-control"
                          name="titulo"
                          value={formData.titulo}
                          onChange={handleChange}
                          placeholder="Título de la noticia"
                          required
                          style={{ borderColor: '#046a4f' }}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label" style={{ color: '#046a4f', fontWeight: '600' }}>Contenido</label>
                        <textarea
                          className="form-control"
                          name="contenido"
                          value={formData.contenido}
                          onChange={handleChange}
                          placeholder="Contenido de la noticia"
                          rows="6"
                          required
                          style={{ borderColor: '#046a4f' }}
                        ></textarea>
                      </div>

                      <div className="mb-3">
                        <label className="form-label" style={{ color: '#046a4f', fontWeight: '600' }}>Imagen</label>
                        <input
                          type="file"
                          accept="image/*"
                          className="form-control"
                          name="imagen"
                          onChange={handleChange}
                          style={{ borderColor: '#046a4f' }}
                        />
                        <small style={{ color: '#888' }}>Formatos soportados: JPG, PNG, GIF, WEBP</small>
                      </div>

                      {mensaje && (
                        <div className={`alert ${mensaje.includes('Error') ? 'alert-danger' : 'alert-success'} alert-dismissible fade show`} role="alert">
                          <i className={mensaje.includes('Error') ? 'bi bi-exclamation-circle' : 'bi bi-check-circle'}></i> {mensaje}
                          <button type="button" className="btn-close" onClick={() => setMensaje('')}></button>
                        </div>
                      )}

                      <div className="d-flex gap-2">
                        <button
                          type="submit"
                          className="btn flex-grow-1"
                          style={{ backgroundColor: '#046a4f', color: 'white', fontWeight: 'bold', padding: '12px' }}
                        >
                          {editando ? 'Actualizar Noticia' : 'Crear Noticia'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setMostrarFormulario(false)}
                          className="btn btn-secondary"
                          style={{ padding: '12px 20px' }}
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* LISTA DE NOTICIAS */}
                {loading ? (
                  <div className="text-center">
                    <div className="spinner-border" role="status" style={{ color: '#046a4f' }}>
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    {noticias.length > 0 ? (
                      <div className="row g-4">
                        {noticias.slice(0, 10).map((noticia) => (
                          <div key={noticia.id} className="col-lg-6">
                            <div className="bg-white rounded shadow-sm overflow-hidden" style={{ borderLeft: '5px solid #069169', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                              {noticia.imagen && (
                                <img 
                                  src={`https://sindicato-w3ev.onrender.com/uploads/noticias/${noticia.imagen}`}
                                  alt={noticia.titulo}
                                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                />
                              )}
                              <div className="p-4" style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ color: '#046a4f', fontWeight: 'bold', marginBottom: '10px' }}>
                                  {noticia.titulo}
                                </h3>
                                <p style={{ color: '#666', marginBottom: '10px', flex: '1' }}>
                                  {noticia.contenido.substring(0, 150)}...
                                </p>
                                {noticia.fecha_publicacion && (
                                  <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '15px' }}>
                                    <i className="bi bi-calendar-event"></i> {new Date(noticia.fecha_publicacion).toLocaleDateString('es-ES')}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="alert alert-info" style={{ color: '#046a4f', backgroundColor: '#d1f0ed', borderColor: '#046a4f' }}>
                        <i className="bi bi-info-circle"></i> No hay noticias disponibles
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
