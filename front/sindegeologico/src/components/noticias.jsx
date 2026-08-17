import React, { useState, useEffect } from 'react';

export default function Noticias() {
  const [noticia, setNoticia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarNoticia();
    
    // Refrescar cada 30 segundos
    const intervalo = setInterval(cargarNoticia, 30000);
    return () => clearInterval(intervalo);
  }, []);

  const cargarNoticia = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/noticias?t=' + new Date().getTime());
      const data = await response.json();
      console.log('Noticias cargadas:', data.data);
      // Obtener la noticia más reciente
      if (data.data && data.data.length > 0) {
        setNoticia(data.data[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error cargando noticia:', error);
      setLoading(false);
    }
  };

  return (
    <>
      <header id="header" className="header d-flex flex-column">
        <div className="branding d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #069169 0%, #046a4f 100%)', padding: '15px 0', minHeight: '160px' }}>
          <div className="container-fluid d-flex align-items-center justify-content-between px-4">
            
            {/* 1. LADO IZQUIERDO: LOGO */}
            <div className="d-flex align-items-center gap-3">
              <a href="/" className="logo d-flex align-items-center text-decoration-none">
                <img src="/assets/img/logoSGC.jpg" alt="SGC Logo" style={{ height: '120px', width: 'auto', maxHeight: 'none', objectFit: 'contain' }} />
              </a>
            </div>

            {/* 2. CENTRO: TU NUEVA FRASE CON MÁS COLOR Y NEGRILLA */}
            <div className="d-none d-lg-block flex-grow-1 text-center px-4">
              <h2 className="mb-0" style={{ 
                fontFamily: "'Montserrat', sans-serif", 
                fontWeight: '800',
                fontStyle: 'italic', 
                fontSize: '1.7rem',
                color: '#ffffff',
                textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)'
              }}>
                "Si estamos unidos, nadie queda atrás"
              </h2>
            </div>

            {/* 3. LADO DERECHO: MENÚ DE NAVEGACIÓN */}
            <nav id="navmenu" className="navmenu">
              <ul className="d-flex gap-4 list-unstyled mb-0">
                <li><a href="/index.html" className="active text-white text-decoration-none">Home</a></li>
                <li><a href="/index.html#quienessomos" className="text-white text-decoration-none">Quiénes Somos</a></li>
                <li><a href="/index.html#about" className="text-white text-decoration-none">Historia</a></li>
                <li><a href="#portfolio" className="text-white text-decoration-none">Misión</a></li>
                <li><a href="/noticias.html" className="text-white text-decoration-none fw-bold ">NOTICIAS</a></li>
                <li><a href="/formulario-sindegeologico.html" className="text-white text-decoration-none fw-bold">INSCRIBETE</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="main">
        <section id="noticias" style={{ backgroundColor: '#e3f3f0', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
          <div className="container">
            {loading ? (
              <div className="text-center">
                <div className="spinner-border" role="status" style={{ color: '#046a4f' }}>
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : noticia ? (
              <div className="row g-5 align-items-center">
                <div className="col-lg-6">
                  <div className="content">
                    <h2 style={{ color: '#046a4f', fontWeight: 'bold', fontSize: '2.5rem' }}>Noticias</h2>
                    <h3 className="mb-4" style={{ color: '#046a4f', fontWeight: 'bold', fontSize: '1.8rem' }}>
                      {noticia.titulo}
                    </h3>
                    {noticia.fecha_publicacion && (
                      <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '15px' }}>
                        <i className="bi bi-calendar-event"></i> {new Date(noticia.fecha_publicacion).toLocaleDateString('es-ES')}
                      </p>
                    )}
                    <div className="description text-muted" style={{ lineHeight: '1.8', fontSize: '1.05rem', textAlign: 'justify' }}>
                      <p>
                        {noticia.contenido}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6 d-flex align-items-center">
                  <div className="image-container" style={{ width: '100%' }}>
                    {noticia.imagen ? (
                      <img 
                        src={`http://localhost:5000/uploads/noticias/${noticia.imagen}`} 
                        alt={noticia.titulo} 
                        className="img-fluid rounded shadow-lg" 
                        style={{ objectFit: 'cover', width: '100%', height: 'auto', maxHeight: '450px' }} 
                      />
                    ) : (
                      <div 
                        className="bg-light rounded shadow-lg d-flex align-items-center justify-content-center" 
                        style={{ width: '100%', height: '450px', color: '#999' }}
                      >
                        <p>Sin imagen</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="alert alert-info" style={{ color: '#046a4f', backgroundColor: '#d1f0ed', borderColor: '#046a4f' }}>
                <i className="bi bi-info-circle"></i> No hay noticias disponibles
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}