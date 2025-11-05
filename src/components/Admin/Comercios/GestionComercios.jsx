import { useState } from 'react';
import ComerciosGrid from './ComerciosGrid';

export default function GestionComercios() {
  const [comercios, setComercios] = useState([]);

  const handleNuevoComercio = () => {
    // Lógica para agregar nuevo comercio
  };

  return (
    <div className="section-container">
      <div className="section-header">
        <h2>Gestión de Comercios</h2>
        <button className="btn-primary" onClick={handleNuevoComercio}>
          + Nuevo Comercio
        </button>
      </div>
      <ComerciosGrid comercios={comercios} />
    </div>
  );
}