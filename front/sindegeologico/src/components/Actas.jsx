import React, { useEffect, useState } from 'react';

export default function Actas() {
  const [usuario, setUsuario] = useState(null);
  const [actas, setActas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState(null);
  const [mensajeError, setMensajeError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [formData, setFormData] = useState({
    numero_acta: '',
    nombre_acta: '',
    fecha_acta: '',
    observaciones: '',
    archivo: null
  });

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

    // Cargar actas de la API
    const cargarActasInit = async () => {
      try {
        const response = await fetch('https://sindicato-w3ev.onrender.com/api/actas');
        const data = await response.json();
        setActas(data.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error cargando actas:', error);
        setLoading(false);
      }
    };

    cargarActasInit();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    window.location.href = '/index.html';
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        archivo: files[0] || null
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
      numero_acta: '',
      nombre_acta: '',
      fecha_acta: '',
      observaciones: '',
      archivo: null
    });
    setEditando(null);
    setMensajeError('');
  };

  const abrirFormularioNuevo = () => {
    limpiarFormulario();
    setMostrarFormulario(true);
  };

  const abrirFormularioEditar = (acta) => {
    setFormData({
      nombre_acta: acta.nombre_acta || '',
      numero_acta: acta.numero_acta || '',
      fecha_acta: acta.fecha_acta || '',
      observaciones: acta.observaciones || '',
      archivo: null
    });
    setEditando(acta.id);
    setMostrarFormulario(true);
  };

  const guardarActa = async (e) => {
    e.preventDefault();
    setMensajeError('');
    setMensajeExito('');

    if (!formData.numero_acta || !formData.fecha_acta) {
      setMensajeError('Número de acta y fecha son requeridos');
      return;
    }

    try {
      const url = editando 
        ? `https://sindicato-w3ev.onrender.com/api/actas/${editando}`
        : 'https://sindicato-w3ev.onrender.com/api/actas';
      
      const method = editando ? 'PUT' : 'POST';

      // Siempre usar FormData para consistencia
      const body = new FormData();
      body.append('numero_acta', formData.numero_acta);
      body.append('nombre_acta', formData.nombre_acta);
      body.append('fecha_acta', formData.fecha_acta);
      body.append('observaciones', formData.observaciones);
      if (formData.archivo) {
        body.append('archivo', formData.archivo);
      }

      const response = await fetch(url, {
        method: method,
        body: body
        // NO incluir Content-Type - el navegador lo establece automáticamente
      });

      const data = await response.json();

      if (data.success) {
        setMensajeExito(editando ? 'Acta actualizada exitosamente' : 'Acta creada exitosamente');
        setMostrarFormulario(false);
        cargarActas();
        setTimeout(() => setMensajeExito(''), 3000);
      } else {
        setMensajeError(data.message || 'Error al guardar');
      }
    } catch (error) {
      setMensajeError('Error: ' + error.message);
    }
  };

  const eliminarActa = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta acta?')) return;

    try {
      const response = await fetch(`https://sindicato-w3ev.onrender.com/api/actas/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setMensajeExito('Acta eliminada exitosamente');
        cargarActas();
        setTimeout(() => setMensajeExito(''), 3000);
      } else {
        setMensajeError(data.message || 'Error al eliminar');
      }
    } catch (error) {
      setMensajeError('Error: ' + error.message);
    }
  };

  const cargarActas = async () => {
    try {
      const response = await fetch('https://sindicato-w3ev.onrender.com/api/actas');
      const data = await response.json();
      setActas(data.data || []);
    } catch (error) {
      console.error('Error cargando actas:', error);
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

      <main className="main">
        <section style={{ backgroundColor: '#e3f3f0', minHeight: '90vh', paddingTop: '40px', paddingBottom: '40px' }}>
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h1 style={{ color: '#046a4f', fontWeight: 'bold', fontSize: '2.5rem' }}>
                    <i className="bi bi-file-text"></i> Actas
                  </h1>
                  <div className="d-flex gap-2">
                    <button onClick={abrirFormularioNuevo} className="btn" style={{ backgroundColor: '#069169', color: 'white', fontWeight: 'bold' }}>
                      <i className="bi bi-plus-circle"></i> Nueva Acta
                    </button>
                    <a href="/menu.html" className="btn" style={{ backgroundColor: '#046a4f', color: 'white' }}>
                      Volver al Menú
                    </a>
                  </div>
                </div>

                {/* BUSCADOR */}
                <div className="mb-4">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Buscar acta..."
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    style={{ borderColor: '#046a4f', borderWidth: '2px' }}
                  />
                </div>

                {/* MENSAJES */}
                {mensajeExito && (
                  <div className="alert alert-success alert-dismissible fade show" role="alert">
                    <i className="bi bi-check-circle"></i> {mensajeExito}
                    <button type="button" className="btn-close" onClick={() => setMensajeExito('')}></button>
                  </div>
                )}
                {mensajeError && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="bi bi-exclamation-circle"></i> {mensajeError}
                    <button type="button" className="btn-close" onClick={() => setMensajeError('')}></button>
                  </div>
                )}

                {loading ? (
                  <div className="text-center">
                    <div className="spinner-border" role="status" style={{ color: '#046a4f' }}>
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    {actas.filter(acta =>
                      (acta.numero_acta || '').toLowerCase().includes(filtro.toLowerCase()) ||
                      (acta.observaciones || '').toLowerCase().includes(filtro.toLowerCase())
                    ).length > 0 ? (
                      <div className="row g-4">
                        {actas.filter(acta =>
                          (acta.numero_acta || '').toLowerCase().includes(filtro.toLowerCase()) ||
                          (acta.observaciones || '').toLowerCase().includes(filtro.toLowerCase())
                        ).map((acta) => (
                          <div key={acta.id} className="col-lg-6">
                            <div className="bg-white rounded shadow-sm p-4" style={{ borderLeft: '5px solid #069169', minHeight: '250px', display: 'flex', flexDirection: 'column' }}>
                              <h3 style={{ color: '#046a4f', fontWeight: 'bold', marginBottom: '10px' }}>
                                Acta #{acta.numero_acta}
                              </h3>
                              {acta.nombre_acta && (
                                <p style={{ color: '#046a4f', fontSize: '1.1rem', fontWeight: '500', marginBottom: '15px' }}>
                                  {acta.nombre_acta}
                                </p>
                              )}
                              <p style={{ color: '#666', marginBottom: '10px' }}>
                                <strong>Observaciones:</strong> {acta.observaciones || 'Sin observaciones'}
                              </p>
                              {acta.fecha_acta && (
                                <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '15px' }}>
                                  <i className="bi bi-calendar-event"></i> {new Date(acta.fecha_acta).toLocaleDateString('es-ES')}
                                </p>
                              )}
                              {acta.archivo_pdf && (
                                <p style={{ marginBottom: '15px' }}>
                                  <a 
                                    href={`https://sindicato-w3ev.onrender.com/uploads/actas/${acta.archivo_pdf}`} 
                                    download 
                                    className="btn btn-sm"
                                    style={{ backgroundColor: '#069169', color: 'white', textDecoration: 'none' }}
                                  >
                                    <i className="bi bi-download"></i> Descargar PDF
                                  </a>
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="alert alert-info" style={{ color: '#046a4f', backgroundColor: '#d1f0ed', borderColor: '#046a4f' }}>
                        <i className="bi bi-info-circle"></i> No se encontraron actas
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* MODAL DEL FORMULARIO */}
      {mostrarFormulario && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header" style={{ backgroundColor: '#046a4f', color: 'white' }}>
                <h5 className="modal-title">
                  {editando ? 'Editar Acta' : 'Nueva Acta'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setMostrarFormulario(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={guardarActa}>
                  <div className="mb-3">
                    <label className="form-label" style={{ color: '#046a4f', fontWeight: '600' }}>
                      Número de Acta *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="numero_acta"
                      value={formData.numero_acta}
                      onChange={handleInputChange}
                      style={{ borderColor: '#046a4f' }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label" style={{ color: '#046a4f', fontWeight: '600' }}>
                      Nombre del Acta
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="nombre_acta"
                      value={formData.nombre_acta}
                      onChange={handleInputChange}
                      placeholder="Ej: Junta Directiva - Agosto 2026"
                      style={{ borderColor: '#046a4f' }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label" style={{ color: '#046a4f', fontWeight: '600' }}>
                      Fecha del Acta *
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      name="fecha_acta"
                      value={formData.fecha_acta}
                      onChange={handleInputChange}
                      style={{ borderColor: '#046a4f' }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label" style={{ color: '#046a4f', fontWeight: '600' }}>
                      Observaciones
                    </label>
                    <textarea
                      className="form-control"
                      name="observaciones"
                      value={formData.observaciones}
                      onChange={handleInputChange}
                      rows="4"
                      style={{ borderColor: '#046a4f' }}
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label" style={{ color: '#046a4f', fontWeight: '600' }}>
                      Archivo PDF
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      name="archivo"
                      accept=".pdf"
                      onChange={handleInputChange}
                      style={{ borderColor: '#046a4f' }}
                    />
                    {formData.archivo && (
                      <small className="text-success mt-2 d-block">
                        ✓ Archivo seleccionado: {formData.archivo.name}
                      </small>
                    )}
                  </div>

                  {mensajeError && (
                    <div className="alert alert-danger" role="alert">
                      {mensajeError}
                    </div>
                  )}
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setMostrarFormulario(false)}>
                  Cancelar
                </button>
                <button type="button" className="btn" style={{ backgroundColor: '#046a4f', color: 'white' }} onClick={guardarActa}>
                  {editando ? 'Actualizar' : 'Crear'} Acta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
