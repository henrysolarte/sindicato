import React, { useState } from 'react';

export default function Services() {
  // Estado para controlar cuál de las imágenes está aumentada
  const [servicioActivo, setServicioActivo] = useState(null);

  // Lista con la extensión exacta (.jpeg) comprobada en tu explorador de Windows
 const imagenesServicios = [
    { id: 5, src: '/assets/img/fotosind10.jpeg', alt: 'Sindicato Imagen 14' },
    { id: 6, src: '/assets/img/imagen6.jpeg', alt: 'Sindicato Imagen 6' },
    { id: 7, src: '/assets/img/imagen7.jpeg', alt: 'Sindicato Imagen 7' },
    { id: 8, src: '/assets/img/imagen8.jpeg', alt: 'Sindicato Imagen 8' } // ◄ Cambiado de .jpeg a .jpg
  ];
  return (
    <section id="services" className="services section py-5" style={{ overflow: 'visible' }}>
      <div className="container text-center mb-5">
        <h2 style={{ color: '#046a4f', fontWeight: 'bold' }}>Nuestra Gestión y Eventos</h2>
        <p className="text-muted fw-bold">
          <a
            href="/formulario-sindegeologico.html"
            className="text-decoration-none"
            style={{ color: 'inherit' }}
          >
            <i className="bi bi-cursor-fill text-success"></i> INSCRIBETE
          </a>
        </p>
      </div>

      <div className="container">
        {/* g-4 alinea y distribuye el espacio perfectamente entre las tarjetas */}
        <div className="row g-4 justify-content-center">
          {imagenesServicios.map((img) => {
            const estaAgrandada = servicioActivo === img.id;

            return (
              /* col-lg-3 divide las 4 imágenes en columnas iguales en pantallas grandes */
              <div className="col-md-6 col-lg-3" key={img.id} style={{ zIndex: estaAgrandada ? 99 : 1 }}>
                <div 
                  onClick={() => setServicioActivo(estaAgrandada ? null : img.id)}
                  className="p-2 border rounded shadow-sm bg-white text-center h-100"
                  style={{ 
                    cursor: 'pointer', 
                    transition: 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s ease',
                    // Aumenta un 40% (scale 1.4) al hacer clic y regresa a escala 1
                    transform: estaAgrandada ? 'scale(1.4)' : 'scale(1)',
                    boxShadow: estaAgrandada ? '0 15px 35px rgba(0,0,0,0.35)' : '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                >
                  <img 
                    src={img.src} 
                    alt={img.alt} 
                    className="img-fluid rounded" 
                    style={{ 
                      width: '100%', 
                      height: '240px', // Altura fija para emular el tamaño del cuadro original
                      objectFit: 'cover' 
                    }} 
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