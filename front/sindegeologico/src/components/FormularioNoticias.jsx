import React, { useState } from 'react';

export default function FormularioNoticias() {
  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    imagen: ''
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
      const response = await fetch('http://localhost:5000/api/noticias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        setMensaje('✓ Noticia agregada exitosamente');
        setFormData({ titulo: '', contenido: '', imagen: '' });
      } else {
        setMensaje('Error: ' + data.message);
      }
    } catch (error) {
      setMensaje('Error en la conexión: ' + error.message);
    }
  };

  return (
    <section style={{ backgroundColor: '#e3f3f0', minHeight: '80vh', display: 'flex', alignItems: 'center', paddingTop: '40px', paddingBottom: '40px' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="bg-white rounded shadow-sm p-5">
              <h2 style={{ color: '#046a4f', fontWeight: 'bold', fontSize: '2.5rem', marginBottom: '30px', textAlign: 'center' }}>
                Agregar Noticia
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label" style={{ color: '#046a4f', fontWeight: '600' }}>Título</label>
                  <input
                    type="text"
                    className="form-control"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    required
                    style={{ borderColor: '#046a4f' }}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label" style={{ color: '#046a4f', fontWeight: '600' }}>Contenido</label>
                  <textarea
                    className="form-control"
                    name="contenido"
                    rows="6"
                    value={formData.contenido}
                    onChange={handleChange}
                    required
                    style={{ borderColor: '#046a4f' }}
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label" style={{ color: '#046a4f', fontWeight: '600' }}>URL de Imagen</label>
                  <input
                    type="text"
                    className="form-control"
                    name="imagen"
                    value={formData.imagen}
                    onChange={handleChange}
                    placeholder="/assets/img/..."
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
                  Publicar Noticia
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
