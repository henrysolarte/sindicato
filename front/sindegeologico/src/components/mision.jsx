import React from 'react';

export default function Mision() {
  return (
    <section id="portfolio" className="skills section py-5 bg-light">
      <div className="container">
        <div className="text-center mb-5">
          <h2 style={{ color: '#046a4f', fontWeight: 'bold' }}>MISION</h2>
        </div>

        <div className="row align-items-center g-4">
          <div className="col-lg-6">
            <div
              className="bg-white rounded shadow-sm p-4 p-lg-5"
              style={{ lineHeight: '1.8', fontSize: '1.05rem', textAlign: 'justify' }}
            >
              <p>
                Representar, defender y promover los derechos e intereses laborales,
                sociales, economicos y profesionales de los afiliados al Sindicato de
                Empleados del Servicio Geologico Colombiano (SINDEGEOLOGICO), fomentando
                el dialogo social, la unidad, la participacion democratica y el respeto
                por la dignidad humana, contribuyendo al fortalecimiento institucional
                del Servicio Geologico Colombiano y al bienestar integral de sus
                funcionarios.
              </p>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="text-center">
              <img
                src="/assets/img/fotosind11.jpg"
                alt="Mision SINDEGEOLOGICO"
                className="img-fluid rounded shadow-sm"
                style={{ width: '100%', maxHeight: '420px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}