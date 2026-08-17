import './Footer.scss';

export default function Footer() {
  return (
    <div className="FondoFooter">
      <div className="pagFooter">
        {/* FOOTER 2DA VERSION */}
        <div className="ContenedorFooter">
          <h2>SINDEGEOLÓGICO</h2>
          <h4>Si estamos unidos, nadie queda atrás</h4>

          <div className="row">
            <div className="Descripcion col-4">
              <p>Dirección: Diagonal 53 N0. 34 - 53 Bogotá D.C. Colombia</p>
              <p>Código Postal: 111321</p>
              <p>Teléfono conmutador: (601) 220 0200</p>
            </div>

            <div className="Descripcion col-4">
              <p>Correo Institucional: sindegeologico@sgc.gov.co</p>
              <p>Correo de notificaciones judiciales: sindegeologico@sgc.gov.co</p>
              
            </div>

            <div className="col-4">
              <div className="Botones">
                <div className="row LogoSGCRow">
                  <img src="/assets/img/Logo_SGC.svg" className="LogoSGC col-12" alt="Logo SGC"/>
                </div>

                <div className="row Redes">
                  <div className="BotonesRedes col-4">
                    <a href="#">
                      <button className="CenteredButton" aria-label="Twitter">
                        <img src="/assets/img/x-twitter.svg" alt="Iconotwitter"/>
                      </button>
                    </a>
                    <p>Twitter</p>
                  </div>

                  <div className="BotonesRedes col-4">
                    <a href="">
                      <button className="CenteredButton" aria-label="instagram">
                        <img src="/assets/img/instagram.svg" alt="IconoInsta"/>
                      </button>
                    </a>
                    <p>Instagram</p>
                  </div>

                  <div className="BotonesRedes col-4">
                    <a href="#">
                      <button className="CenteredButton" aria-label="facebook">
                        <img src="/assets/img/facebook.svg" alt="IconoFacebook"/>
                      </button>
                    </a>
                    <p>Facebook</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          
        </div>
      </div>
      
    </div>
  );
}
