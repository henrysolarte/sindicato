import React from 'react';

export default function About() {
  return (
    <section id="about" style={{ backgroundColor: '#e3f3f0', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      

      <div className="container">
        <div className="row g-5 align-items-start">
          <div className="col-lg-6">
            <div className="content">
               <h2 style={{ color: '#046a4f', fontWeight: 'bold', fontSize: '2.5rem' }}>Historia de Sindegeologico</h2>
        <p className="lead text-muted" style={{ lineHeight: '1.8', fontSize: '1.1rem' }}>El sindicato de los trabajadores</p>
              <h2 className="mb-4" style={{ color: '#046a4f', fontWeight: 'bold', fontSize: '2.1rem' }}>Cincuenta años de unidad, compromiso y defensa de los trabajadores</h2>
              <p className="lead my-4 text-muted" style={{ lineHeight: '1.8', fontSize: '1.1rem', textAlign: 'justify' }}>La historia de SINDEGEOLÓGICO es la historia de mujeres y hombres que comprendieron que la mejor forma de proteger la dignidad del trabajo público era actuando unidos.</p>
              <div className="description text-muted" style={{ lineHeight: '1.8', fontSize: '1.05rem', textAlign: 'justify' }}>
                <p>El origen de nuestra organización se remonta al 3 de octubre de 1972, fecha en la cual 41 funcionarios del entonces Instituto Nacional de Investigaciones Geológico-Mineras – INGEOMINAS decidieron constituir una organización sindical para defender sus derechos laborales, promover condiciones de trabajo más justas y fortalecer la voz colectiva de los servidores públicos. Desde ese momento nació un proyecto basado en la solidaridad, la participación democrática y el compromiso con el servicio al país.</p>
                <p>Este esfuerzo obtuvo reconocimiento legal mediante la Personería Jurídica No. 001330 del 14 de mayo de 1975, consolidando formalmente una organización que, con el paso de los años, se convertiría en un referente de la representación sindical dentro del sector geocientífico colombiano.</p>
                <p>A lo largo de su trayectoria, la institución evolucionó junto con las transformaciones del Estado colombiano. El antiguo INGEOMINAS dio paso al actual Servicio Geológico Colombiano, y la organización sindical adoptó el nombre de Sindicato de Empleados del Servicio Geológico Colombiano – SINDEGEOLÓGICO, manteniendo intacta su misión de defender los derechos de los trabajadores y contribuir al fortalecimiento de la función pública.</p>
                <p style={{ fontWeight: '600' }}>
                  ...<a href="/historia.html" style={{ color: '#046a4f', textDecoration: 'none' }}>Leer más</a>
                </p>
              <h2 className="text-center mt-4" style={{ color: '#046a4f', fontWeight: 'bold' }}>"Si estamos unidos, nadie queda atrás."</h2>
              </div>

              

              
            </div>
          </div>

          <div className="col-lg-6 d-flex align-items-start">
            <div className="image-container position-relative" style={{ marginTop: '20px' }}>
              <img src="/assets/img/fotosind1.jpeg" alt="Sindegeologico" className="img-fluid rounded shadow-lg" style={{ objectFit: 'cover', width: '100%', height: 'auto', maxHeight: '450px' }} />
              <img src="/assets/img/fotosind8.jpeg" alt="Sindegeologico 8" className="img-fluid rounded shadow-lg" style={{ objectFit: 'cover', width: '100%', height: 'auto', maxHeight: '450px', marginTop: '20px' }} />
              
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}