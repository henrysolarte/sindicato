import React, { useState } from 'react';

export default function Login() {
  const [formData, setFormData] = useState({
    correo: '',
    contrasena: ''
  });
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: formData.correo,
          contrasena: formData.contrasena
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setMensaje('✓ Login exitoso - ' + data.usuario.nombre);
        setFormData({ correo: '', contrasena: '' });
        // Guardar usuario en localStorage y redirigir
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        setTimeout(() => {
          window.location.href = '/menu.html';
        }, 1000);
      } else {
        setMensaje('Error: ' + data.message);
      }
    } catch (error) {
      setMensaje('Error en la conexión: ' + error.message);
    }
  };

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
              <h2 className="mb-0" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '800', fontStyle: 'italic', fontSize: '1.7rem', color: '#ffffff', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)' }}>
                "Si estamos unidos, nadie queda atrás"
              </h2>
            </div>
          </div>
        </div>
      </header>

      <main className="main">
        <section style={{ backgroundColor: '#e3f3f0', minHeight: '90vh', display: 'flex', alignItems: 'center', paddingTop: '40px', paddingBottom: '40px' }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <div className="bg-white rounded shadow-sm p-5">
                  <h2 style={{ color: '#046a4f', fontWeight: 'bold', fontSize: '2.5rem', marginBottom: '30px', textAlign: 'center' }}>
                    Iniciar Sesión
                  </h2>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label" style={{ color: '#046a4f', fontWeight: '600' }}>Correo Electrónico</label>
                      <input
                        type="email"
                        className="form-control"
                        name="correo"
                        value={formData.correo}
                        onChange={handleChange}
                        required
                        style={{ borderColor: '#046a4f' }}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label" style={{ color: '#046a4f', fontWeight: '600' }}>Contraseña</label>
                      <input
                        type="password"
                        className="form-control"
                        name="contrasena"
                        value={formData.contrasena}
                        onChange={handleChange}
                        required
                        style={{ borderColor: '#046a4f' }}
                      />
                    </div>

                    {mensaje && (
                      <div className="alert alert-info" role="alert" style={{ color: '#046a4f', backgroundColor: '#d1f0ed', borderColor: '#046a4f' }}>
                        {mensaje}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="btn w-100"
                      style={{ backgroundColor: '#046a4f', color: 'white', fontWeight: 'bold', padding: '12px', marginTop: '20px' }}
                    >
                      Iniciar Sesión
                    </button>
                  </form>

                  <div className="text-center mt-4">
                    <p style={{ color: '#046a4f' }}>
                      ¿No tienes cuenta? <a href="/registro.html" style={{ color: '#046a4f', fontWeight: 'bold', textDecoration: 'none' }}>Regístrate aquí</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
