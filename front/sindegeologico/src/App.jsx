import React from 'react';
import Header from './components/Header';
import QuienesSomos from './components/quienessomos';
import Historia from './components/historia';
import Mision from './components/mision';
import Vision from './components/vision';
import Services from './components/Services';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Header />
      <main className="main">
        <QuienesSomos />
        
        {/* PASAMOS TU GALERÍA DE IMÁGENES AQUÍ ARRIBA DE ABOUT */}
        <Services /> 
        
        <Historia />
       
        <Mision />
        <Vision />
      </main>
      <Footer />
    </>
  );
}

export default App;