import React from 'react';

export default function Header() {
  return (
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
              fontWeight: '800', // '800' o 'bold' activa la negrilla ultra-fuerte
              fontStyle: 'italic', 
              fontSize: '1.7rem', // Subimos un poco el tamaño para darle más presencia
              color: '#ffffff', // Blanco puro brillante
              textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)' // Una sombra muy sutil negra detrás para que las letras resalten el triple sobre el verde
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
              <li><a href="/login.html" className="text-white text-decoration-none fw-bold">ADMINISTRAR</a></li>
            </ul>
          </nav>
        </div>
      </div>

      {/* BLOQUE DEL VIDEO CORREGIDO ANTERIORMENTE */}
      <div className="d-flex justify-content-center my-4">
        <video 
          width="40%" 
          height="auto" 
          controls 
          autoPlay 
          playsInline
          muted 
          loop
          preload="auto"
          style={{ 
            display: 'block', 
            borderRadius: '10px', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
          }}
        >
          <source src="/assets/video/video.mp4" type="video/mp4" />
          Tu navegador no soporta el tag de video.
        </video>
      </div>
    </header>
  );
}