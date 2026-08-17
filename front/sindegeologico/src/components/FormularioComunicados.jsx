import React, { useState, useEffect } from 'react';

export default function FormularioComunicados() {
  const [usuario, setUsuario] = useState(null);
  const [comunicados, setComunicados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fecha: '',
    elaboracion: '',
    archivo: null,
    observaciones: ''
  });
  const [mensaje, setMensaje] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

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

    // Cargar comunicados de la API
    cargarComunicados();
  }, []);

  const cargarComunicados = async () => {
    try {
      const response = await fetch('https://sindicato-w3ev.onrender.com/api/comunicados');
      const data = await response.json();
      setComunicados(data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error cargando comunicados:', error);
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
        archivo: files[0] || null
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Siempre usar FormData para consistencia
      const body = new FormData();
      body.append('fecha', formData.fecha);
      body.append('elaboracion', formData.elaboracion);
      body.append('observaciones', formData.observaciones);
      if (formData.archivo) {
        body.append('archivo', formData.archivo);
      }

      const response = await fetch('https://sindicato-w3ev.onrender.com/api/comunicados', {
        method: 'POST',
        body: body
        // NO incluir Content-Type - el navegador lo establece automáticamente
      });

      const data = await response.json();
      
      if (data.success) {
        setMensaje('✓ Comunicado agregado exitosamente');
        setFormData({ fecha: '', elaboracion: '', archivo: null, observaciones: '' });
        setMostrarFormulario(false);
        cargarComunicados();
        setTimeout(() => setMensaje(''), 3000);
      } else {
        setMensaje('Error: ' + data.message);
      }
    } catch (error) {
      setMensaje('Error en la conexión: ' + error.message);
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
                    <i className="bi bi-file-earmark-pdf"></i> Comunicados
                  </h1>
                  <div className="d-flex gap-2">
                    <button onClick={() => setMostrarFormulario(!mostrarFormulario)} className="btn" style={{ backgroundColor: '#069169', color: 'white', fontWeight: 'bold' }}>
                      <i className="bi bi-plus-circle"></i> Nuevo Comunicado
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
                      Agregar Comunicado
                    </h2>

                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label className="form-label" style={{ color: '#046a4f', fontWeight: '600' }}>Fecha</label>
                        <input
                          type="date"
                          className="form-control"
                          name="fecha"
                          value={formData.fecha}
                          onChange={handleChange}
                          required
                          style={{ borderColor: '#046a4f' }}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label" style={{ color: '#046a4f', fontWeight: '600' }}>Elaboración</label>
                        <input
                          type="text"
                          className="form-control"
                          name="elaboracion"
                          value={formData.elaboracion}
                          onChange={handleChange}
                          placeholder="Ej: Comunicado, Acta de Reunión"
                          required
                          style={{ borderColor: '#046a4f' }}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label" style={{ color: '#046a4f', fontWeight: '600' }}>Archivo PDF</label>
                        <input
                          type="file"
                          accept=".pdf"
                          className="form-control"
                          name="archivo"
                          onChange={handleChange}
                          style={{ borderColor: '#046a4f' }}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label" style={{ color: '#046a4f', fontWeight: '600' }}>Observaciones</label>
                        <textarea
                          className="form-control"
                          name="observaciones"
                          rows="4"
                          value={formData.observaciones}
                          onChange={handleChange}
                          style={{ borderColor: '#046a4f' }}
                        ></textarea>
                      </div>

                      {mensaje && (
                        <div className="alert alert-success alert-dismissible fade show" role="alert">
                          <i className="bi bi-check-circle"></i> {mensaje}
                          <button type="button" className="btn-close" onClick={() => setMensaje('')}></button>
                        </div>
                      )}

                      <div className="d-flex gap-2">
                        <button
                          type="submit"
                          className="btn flex-grow-1"
                          style={{ backgroundColor: '#046a4f', color: 'white', fontWeight: 'bold', padding: '12px' }}
                        >
                          Guardar Comunicado
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

                {/* LISTA DE COMUNICADOS */}
                {loading ? (
                  <div className="text-center">
                    <div className="spinner-border" role="status" style={{ color: '#046a4f' }}>
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    {comunicados.length > 0 ? (
                      <div className="row g-4">
                        {comunicados.slice(0, 10).map((comunicado) => (
                          <div key={comunicado.id} className="col-lg-6">
                            <div className="bg-white rounded shadow-sm p-4" style={{ borderLeft: '5px solid #069169', minHeight: '220px', display: 'flex', flexDirection: 'column' }}>
                              <h3 style={{ color: '#046a4f', fontWeight: 'bold', marginBottom: '10px' }}>
                                {comunicado.elaboracion}
                              </h3>
                              {comunicado.observaciones && (
                                <p style={{ color: '#666', marginBottom: '10px', flex: '1' }}>
                                  <strong>Observaciones:</strong> {comunicado.observaciones}
                                </p>
                              )}
                              {comunicado.fecha && (
                                <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '15px' }}>
                                  <i className="bi bi-calendar-event"></i> {new Date(comunicado.fecha).toLocaleDateString('es-ES')}
                                </p>
                              )}
                              {comunicado.archivo_pdf && (
                                <a 
                                  href={`https://sindicato-w3ev.onrender.com/uploads/comunicados/${comunicado.archivo_pdf}`} 
                                  download 
                                  className="btn btn-sm"
                                  style={{ backgroundColor: '#069169', color: 'white', textDecoration: 'none', alignSelf: 'flex-start' }}
                                >
                                  <i className="bi bi-download"></i> Descargar PDF
                                </a>
                              )}
                              {!comunicado.archivo_pdf && (
                                <p style={{ color: '#999', fontSize: '0.9rem', fontStyle: 'italic' }}>
                                  Sin archivo adjunto
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="alert alert-info" style={{ color: '#046a4f', backgroundColor: '#d1f0ed', borderColor: '#046a4f' }}>
                        <i className="bi bi-info-circle"></i> No hay comunicados disponibles
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
