import React, { useEffect, useState } from 'react';

export default function Menu() {
  const [usuario, setUsuario] = useState(null);
  const [actas, setActas] = useState([]);
  const [comunicados, setComunicados] = useState([]);
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener usuario del localStorage
    const usuarioGuardado = localStorage.getItem('usuario');
    if (!usuarioGuardado) {
      window.location.href = '/login.html';
      return;
    }
    setUsuario(JSON.parse(usuarioGuardado));

    // Cargar datos de la API
    const cargarDatos = async () => {
      try {
        const [actasRes, comunicadosRes, noticiasRes] = await Promise.all([
          fetch('http://localhost:5000/api/actas'),
          fetch('http://localhost:5000/api/comunicados'),
          fetch('http://localhost:5000/api/noticias')
        ]);

        const actasData = await actasRes.json();
        const comunicadosData = await comunicadosRes.json();
        const noticiasData = await noticiasRes.json();

        setActas(actasData.data || []);
        setComunicados(comunicadosData.data || []);
        setNoticias(noticiasData.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error cargando datos:', error);
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    window.location.href = '/index.html';
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
            <div className="text-white">
              <p className="mb-2">Bienvenido: <strong>{usuario?.nombre}</strong></p>
              <button onClick={handleLogout} className="btn btn-sm btn-outline-light">Cerrar Sesión</button>
            </div>
          </div>
        </div>
      </header>

      <main className="main">
        <section style={{ backgroundColor: '#e3f3f0', minHeight: '90vh', paddingTop: '40px', paddingBottom: '40px' }}>
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <h1 style={{ color: '#046a4f', fontWeight: 'bold', fontSize: '3rem', marginBottom: '50px', textAlign: 'center' }}>
                  Panel de Administración
                </h1>

                {loading ? (
                  <div className="text-center">
                    <div className="spinner-border" role="status" style={{ color: '#046a4f' }}>
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                  </div>
                ) : (
                  <div className="row g-4">
                    {/* ACTAS */}
                    <div className="col-lg-4">
                      <div className="bg-white rounded shadow-sm p-4 h-100" style={{ borderTop: '5px solid #069169' }}>
                        <h2 style={{ color: '#046a4f', fontWeight: 'bold', fontSize: '1.8rem', marginBottom: '20px' }}>
                          <i className="bi bi-file-text"></i> Actas
                        </h2>
                        <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '20px' }}>
                          {actas.length > 0 ? (
                            <ul className="list-group">
                              {actas.slice(0, 5).map((acta) => (
                                <li key={acta.id} className="list-group-item" style={{ borderLeft: '3px solid #069169' }}>
                                  <div style={{ fontSize: '0.9rem', color: '#046a4f', fontWeight: '500' }}>
                                    Acta N° {acta.numero_acta}
                                  </div>
                                  <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                    {acta.nombre_acta}
                                  </div>
                                  <div style={{ fontSize: '0.8rem', color: '#999' }}>
                                    {new Date(acta.fecha_acta).toLocaleDateString('es-CO')}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p style={{ color: '#888' }}>No hay actas disponibles</p>
                          )}
                        </div>
                        <a href="/actas.html" className="btn w-100" style={{ backgroundColor: '#046a4f', color: 'white', fontWeight: 'bold' }}>
                          Ver todas las Actas
                        </a>
                      </div>
                    </div>

                    {/* COMUNICADOS */}
                    <div className="col-lg-4">
                      <div className="bg-white rounded shadow-sm p-4 h-100" style={{ borderTop: '5px solid #069169' }}>
                        <h2 style={{ color: '#046a4f', fontWeight: 'bold', fontSize: '1.8rem', marginBottom: '20px' }}>
                          <i className="bi bi-megaphone"></i> Comunicados
                        </h2>
                        <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '20px' }}>
                          {comunicados.length > 0 ? (
                            <ul className="list-group">
                              {comunicados.slice(0, 5).map((comunicado) => (
                                <li key={comunicado.id} className="list-group-item" style={{ borderLeft: '3px solid #069169' }}>
                                  <div style={{ fontSize: '0.9rem', color: '#046a4f', fontWeight: '500' }}>
                                    {comunicado.elaboracion}
                                  </div>
                                  <div style={{ fontSize: '0.8rem', color: '#999' }}>
                                    {new Date(comunicado.fecha).toLocaleDateString('es-CO')}
                                  </div>
                                  {comunicado.observaciones && (
                                    <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px' }}>
                                      {comunicado.observaciones.substring(0, 50)}...
                                    </div>
                                  )}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p style={{ color: '#888' }}>No hay comunicados disponibles</p>
                          )}
                        </div>
                        <a href="/comunicados.html" className="btn w-100" style={{ backgroundColor: '#046a4f', color: 'white', fontWeight: 'bold' }}>
                          Ver todos los Comunicados
                        </a>
                      </div>
                    </div>

                    {/* NOTICIAS */}
                    <div className="col-lg-4">
                      <div className="bg-white rounded shadow-sm p-4 h-100" style={{ borderTop: '5px solid #069169' }}>
                        <h2 style={{ color: '#046a4f', fontWeight: 'bold', fontSize: '1.8rem', marginBottom: '20px' }}>
                          <i className="bi bi-newspaper"></i> Noticias
                        </h2>
                        <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '20px' }}>
                          {noticias.length > 0 ? (
                            <ul className="list-group">
                              {noticias.slice(0, 5).map((noticia) => (
                                <li key={noticia.id} className="list-group-item" style={{ borderLeft: '3px solid #069169' }}>
                                  <div style={{ fontSize: '0.9rem', color: '#046a4f', fontWeight: '500' }}>
                                    {noticia.titulo}
                                  </div>
                                  <div style={{ fontSize: '0.8rem', color: '#999' }}>
                                    {new Date(noticia.created_at).toLocaleDateString('es-CO')}
                                  </div>
                                  {noticia.contenido && (
                                    <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px' }}>
                                      {noticia.contenido.substring(0, 50)}...
                                    </div>
                                  )}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p style={{ color: '#888' }}>No hay noticias disponibles</p>
                          )}
                        </div>
                        <div className="d-flex gap-2">
                          <a href="/noticias.html" className="btn flex-grow-1" style={{ backgroundColor: '#046a4f', color: 'white', fontWeight: 'bold' }}>
                            Ver última noticia
                          </a>
                          <a href="/carguenoticias.html" className="btn" style={{ backgroundColor: '#069169', color: 'white', fontWeight: 'bold', padding: '0.475rem 0.75rem' }} title="Agregar Noticias">
                            <i className="bi bi-plus-circle"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
