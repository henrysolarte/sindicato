import React from 'react';
import Footer from './Footer';

export default function About() {
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

      <section id="about" style={{ backgroundColor: '#e3f3f0', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      

      <div className="container">
        <div className="row g-5 align-items-start">
          <div className="col-lg-6">
            <div className="content">
               <h2 style={{ color: '#046a4f', fontWeight: 'bold', fontSize: '2.5rem', textAlign: 'center', marginTop: '20px' }}>Historia de Sindegeologico</h2>
        <p className="lead text-muted" style={{ lineHeight: '1.8', fontSize: '1.1rem' }}>El sindicato de los trabajadores</p>
              <h2 className="mb-4" style={{ color: '#046a4f', fontWeight: 'bold', fontSize: '2.1rem' }}>Cincuenta años de unidad, compromiso y defensa de los trabajadores</h2>
              <p className="lead my-4 text-muted" style={{ lineHeight: '1.8', fontSize: '1.1rem', textAlign: 'justify' }}>La historia de SINDEGEOLÓGICO es la historia de mujeres y hombres que comprendieron que la mejor forma de proteger la dignidad del trabajo público era actuando unidos.</p>
              <div className="description text-muted" style={{ lineHeight: '1.8', fontSize: '1.05rem', textAlign: 'justify' }}>
                 <p>El origen de nuestra organización se remonta al 3 de octubre de 1972, fecha en la cual 41 funcionarios del entonces Instituto Nacional de Investigaciones Geológico-Mineras – INGEOMINAS decidieron constituir una organización sindical para defender sus derechos laborales, promover condiciones de trabajo más justas y fortalecer la voz colectiva de los servidores públicos. Desde ese momento nació un proyecto basado en la solidaridad, la participación democrática y el compromiso con el servicio al país.</p>
                <p>Este esfuerzo obtuvo reconocimiento legal mediante la Personería Jurídica No. 001330 del 14 de mayo de 1975, consolidando formalmente una organización que, con el paso de los años, se convertiría en un referente de la representación sindical dentro del sector geocientífico colombiano.</p>
                <p>A lo largo de su trayectoria, la institución evolucionó junto con las transformaciones del Estado colombiano. El antiguo INGEOMINAS dio paso al actual Servicio Geológico Colombiano, y la organización sindical adoptó el nombre de Sindicato de Empleados del Servicio Geológico Colombiano – SINDEGEOLÓGICO, manteniendo intacta su misión de defender los derechos de los trabajadores y contribuir al fortalecimiento de la función pública.</p>
                <p>Durante estas décadas, SINDEGEOLÓGICO ha trabajado por el mejoramiento de las condiciones laborales, el respeto por la carrera administrativa, la igualdad de oportunidades, la capacitación permanente, el diálogo social y la dignificación del servidor público. Su labor ha estado inspirada en la convicción de que un sindicato no es un escenario de confrontación permanente, sino un espacio de participación democrática, construcción colectiva y búsqueda del bienestar común.</p>            
                <p>Los estatutos vigentes definen a SINDEGEOLÓGICO como una organización sindical de empresa, de primer grado y con jurisdicción en todo el territorio nacional, integrada por los servidores públicos del Servicio Geológico Colombiano. Asimismo, establecen como principios esenciales la defensa de los derechos laborales, la solidaridad entre los afiliados, la participación democrática, la representación de los trabajadores y la promoción del diálogo institucional como mecanismo para alcanzar mejores condiciones de trabajo.</p>
                <p>En la actualidad, SINDEGEOLÓGICO continúa proyectándose hacia el futuro como una organización moderna, participativa y comprometida con los desafíos del Servicio Geológico Colombiano. Reconoce el papel estratégico que cumple la entidad en la investigación científica, la gestión del conocimiento geológico, la transición energética, la gestión del riesgo geológico y la protección de los recursos naturales, convencido de que el fortalecimiento institucional comienza por el reconocimiento y la dignificación de quienes hacen posible su misión.</p>
                <p>Después de más de cinco décadas de existencia, SINDEGEOLÓGICO mantiene vigente el espíritu de aquellos 41 trabajadores que decidieron organizarse para construir un mejor futuro. Hoy esa misma convicción sigue guiando cada una de sus acciones bajo un principio que resume su identidad y compromiso:</p>
                
              
              <h2 className="text-center mt-4" style={{ color: '#046a4f', fontWeight: 'bold' }}>"Si estamos unidos, nadie queda atrás."</h2>
              </div>

              

              
            </div>
          </div>

          <div className="col-lg-6 d-flex align-items-start">
            <div className="image-container position-relative" style={{ marginTop: '20px' }}>
              <img src="/assets/img/fotosind1.jpeg" alt="Sindegeologico" className="img-fluid rounded shadow-lg" style={{ objectFit: 'cover', width: '100%', height: 'auto', maxHeight: '450px' }} />
              <img src="/assets/img/fotosind8.jpeg" alt="Sindegeologico 8" className="img-fluid rounded shadow-lg" style={{ objectFit: 'cover', width: '100%', height: 'auto', maxHeight: '450px', marginTop: '20px' }} />
              <img src="/assets/img/fotosind3.jpeg" alt="Sindegeologico 3" className="img-fluid rounded shadow-lg" style={{ objectFit: 'cover', width: '100%', height: 'auto', maxHeight: '450px', marginTop: '20px' }} />
              <img src="/assets/img/fotosind4.jpeg" alt="Sindegeologico 4" className="img-fluid rounded shadow-lg" style={{ objectFit: 'cover', width: '100%', height: 'auto', maxHeight: '450px', marginTop: '20px' }} />
              
            </div>
          </div>
        </div>
      </div>
      </section>
      <Footer />
    </>
  );
}