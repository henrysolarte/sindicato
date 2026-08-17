import React from 'react';
import Footer from './Footer';

export default function JuntaDirectiva() {
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
              <h2 className="mb-0" style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: '800',
                fontStyle: 'italic',
                fontSize: '1.7rem',
                color: '#ffffff',
                textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)'
              }}>
                "Si estamos unidos, nadie queda atras"
              </h2>
            </div>

            <nav id="navmenu" className="navmenu">
              <ul className="d-flex gap-4 list-unstyled mb-0">
                <li><a href="/index.html" className="active text-white text-decoration-none">Home</a></li>
                <li><a href="/index.html#quienessomos" className="text-white text-decoration-none">Quienes Somos</a></li>
                <li><a href="/index.html#about" className="text-white text-decoration-none">Historia</a></li>
                <li><a href="#portfolio" className="text-white text-decoration-none">Mision</a></li>
                <li><a href="#team" className="text-white text-decoration-none">Vision</a></li>
                <li><a href="/formulario-sindegeologico.html" className="text-white text-decoration-none fw-bold">INSCRIBETE</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <section id="juntadirectiva" className="hero section py-5" style={{ backgroundColor: '#e3f3f0', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <div className="content">
                <h2 className="mb-4" style={{ color: '#046a4f', fontWeight: 'bold', fontSize: '2.5rem' }}>
                  Junta Directiva
                </h2>
                <p className="text-muted" style={{ lineHeight: '1.8', fontSize: '1.1rem', textAlign: 'justify' }}>
                  Direccion sindical de SINDEGEOLOGICO
                </p>

                <ul className="text-muted ps-3" style={{ lineHeight: '1.9', fontSize: '1.08rem' }}>
                  <li>Jaime Alberto Garzon Barrios - Presidente</li>
                  <li>Mercedes Ortiz Montañez - Vicepresidente</li>
                  <li>Esperanza Sanabria- Secretaria</li>
                  <li>Carlos A. Castillo - Tesorero</li>
                  <li>William Cifuentes Suárez - Fiscal</li>
                  <li>Miguel Angel Chia González - Secretaria de Bienestar Social y Seguriad Social</li>
                  <li>Andres Stiven Lugo Cruz - Secretaria de Educación y Formación Profesional</li>
                  <li>Javier Danilo León Cuellar - Secretaria de Planeación y Desarrollo Social</li>
                  <li>Henry Solarte Fajardo - Secretaria de Fomento Cultural</li>
                </ul>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="image-container position-relative">
                <img
                  src="/assets/img/fotosind8.jpeg"
                  alt="Junta Directiva"
                  className="img-fluid rounded shadow-lg"
                  style={{ objectFit: 'cover', width: '100%', height: 'auto', maxHeight: '450px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}