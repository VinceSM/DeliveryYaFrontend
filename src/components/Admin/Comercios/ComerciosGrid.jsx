// src/components/Admin/Comercios/ComerciosGrid.jsx
import ComercioCard from './ComercioCard';

export default function ComerciosGrid({ comercios, loading, filtro }) {
  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Cargando comercios...</p>
      </div>
    );
  }

  if (comercios.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🏪</div>
        <h3>No hay comercios</h3>
        <p>
          {filtro === 'pendientes' 
            ? 'No hay comercios pendientes de aprobación' 
            : filtro === 'activos' 
            ? 'No hay comercios activos' 
            : 'No hay comercios registrados en el sistema'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="cards-grid">
      {comercios.map(comercio => (
        <ComercioCard 
          key={comercio.idComercio} 
          comercio={comercio} 
        />
      ))}
    </div>
  );
}