import React, { useState } from 'react'; // <-- 1. IMPORTACIÓN CORRECTA

export default function QuienesSomos() {
  // <-- 2. EL ESTADO VA AQUÍ (ANTES DEL RETURN)
  const [imagenActiva, setImagenActiva] = useState(null); 

  return (
    <section id="quienessomos" className="hero section py-5" style={{ backgroundColor: '#e3f3f0', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <div className="row g-5 align-items-center">
          
          {/* COLUMNA IZQUIERDA: TEXTO Y BOTONES */}
          <div className="col-lg-6">
            <div className="content">
              <h2 className="mb-4" style={{ color: '#046a4f', fontWeight: 'bold', fontSize: '2.5rem' }}>
                Quiénes somos
              </h2>
              <p className="text-muted" style={{ lineHeight: '1.8', fontSize: '1.1rem', textAlign: 'justify' }}>
                Con medio siglo de historia en el Servicio Geológico Colombiano, <strong>SINDEGEOLÓGICO</strong> fusiona la pasión por la ciencia geológica con el poder de la acción colectiva. Somos un sindicato fundamentado en las más altas virtudes éticas, la solidaridad y la justicia social. Protegemos los derechos de nuestra comunidad y el avance del conocimiento científico de la nación, asegurando un camino donde si estamos unidos, nadie queda atrás.
              </p>
              
              <div className="cta-group d-flex flex-wrap align-items-center gap-4 mt-4">
                <a href="/juntadirectiva.html" className="btn text-white px-4 py-2" style={{ backgroundColor: '#069169', borderColor: '#069169', fontWeight: '500' }}>
                  Junta Directiva
                </a>
                <a 
                  href="/assets/video/video2.mp4" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="d-flex align-items-center gap-2 text-decoration-none" 
                  style={{ color: '#046a4f', fontWeight: '600', fontSize: '1.05rem' }}
                >
                  <i className="bi bi-play-circle-fill" style={{ color: '#069169', fontSize: '1.6rem' }}></i>
                  <span>video</span>
                </a>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: IMAGEN DE LA MARCHA */}
          <div className="col-lg-6">
            <div className="image-container position-relative">
              <img 
                src="/assets/img/sindicato.jpeg" 
                alt="SINDEGEOLÓGICO Presente" 
                className="img-fluid rounded shadow-lg" 
                style={{ objectFit: 'cover', width: '100%', height: 'auto', maxHeight: '450px' }}
              />
            </div>
          </div>
          
        </div>

        {/* 3. SECCIÓN DE LAS 4 IMÁGENES INTERACTIVAS */}
        <div className="row g-4 mt-5">
          <div className="col-12 text-center mb-1">
            <small className="text-muted fw-bold">
              <i className="bi bi-cursor-fill text-success"></i> Haz clic en una imagen para aumentarla un 40%
            </small>
          </div>
          
          {[
            { id: 1, src: '/assets/img/imagen1.jpeg', alt: 'Sindicato Imagen 1' },
            { id: 2, src: '/assets/img/imagen2.jpeg', alt: 'Sindicato Imagen 2' },
            { id: 3, src: '/assets/img/imagen3.jpeg', alt: 'Sindicato Imagen 3' },
            { id: 4, src: '/assets/img/imagen4.jpeg', alt: 'Sindicato Imagen 4' }
          ].map((img) => {
            const estaAgrandada = imagenActiva === img.id;

            return (
              <div className="col-lg-3 col-md-6" key={img.id} style={{ zIndex: estaAgrandada ? 10 : 1 }}>
                <div 
                  onClick={() => setImagenActiva(estaAgrandada ? null : img.id)} 
                  className="feature-item p-2 bg-white rounded shadow-sm text-center h-100 border" 
                  style={{ 
                    cursor: 'pointer', 
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    transform: estaAgrandada ? 'scale(1.4)' : 'scale(1)',
                    boxShadow: estaAgrandada ? '0 10px 25px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                >
                  <img 
                    src={img.src} 
                    alt={img.alt} 
                    className="img-fluid rounded" 
                    style={{ width: '100%', height: '180px', objectFit: 'cover' }} 
                  />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}