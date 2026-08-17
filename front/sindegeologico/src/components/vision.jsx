import React from 'react';

export default function Vision() {
  return (
    <section id="team" className="skills section py-5 bg-light">
      <div className="container">
        <div className="text-center mb-5">
          <h2 style={{ color: '#046a4f', fontWeight: 'bold' }}>VISION</h2>
        </div>

        <div className="row align-items-center g-4">
          <div className="col-lg-6 order-2 order-lg-1">
            <div
              className="bg-white rounded shadow-sm p-4 p-lg-5"
              style={{ lineHeight: '1.8', fontSize: '1.05rem', textAlign: 'justify' }}
            >
              <p className="mb-0">
                Para el año 2030, SINDEGEOLÓGICO será reconocido como un sindicato sólido, transparente, participativo e influyente, líder en la defensa de los derechos laborales y en la promoción del bienestar de los funcionarios del Servicio Geológico Colombiano, consolidándose como un actor estratégico en la construcción de relaciones laborales justas, equitativas y orientadas al desarrollo institucional.
              </p>
            </div>
          </div>

          <div className="col-lg-6 order-1 order-lg-2">
            <div className="text-center">
              <img
                src="/assets/img/fotosind14.jpg"
                alt="Vision SINDEGEOLOGICO"
                className="img-fluid rounded shadow-sm"
                style={{ width: '300%', maxWidth: '560px', maxHeight: '280px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}