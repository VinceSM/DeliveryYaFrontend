// src/components/Admin/Comercios/ComercioCard.jsx
import { useAdminComercios } from '../../../hooks/useAdminComercios';

export default function ComercioCard({ comercio }) {
  const { aprobarComercio, destacarComercio } = useAdminComercios();

  const handleAprobar = async () => {
    try {
      await aprobarComercio(comercio.idComercio);
      alert('Comercio aprobado exitosamente');
    } catch (error) {
      alert('Error al aprobar comercio: ' + error.message);
    }
  };

  const handleDestacar = async (destacado) => {
    try {
      await destacarComercio(comercio.idComercio, destacado);
      alert(`Comercio ${destacado ? 'destacado' : 'des-destacado'} exitosamente`);
    } catch (error) {
      alert('Error al destacar comercio: ' + error.message);
    }
  };

  return (
    <div className={`comercio-card ${comercio.estado}`}>
      <div className="card-header">
        <h4>{comercio.nombreComercio}</h4>
        <div className="card-badges">
          <span className={`badge ${comercio.estado}`}>
            {comercio.estado}
          </span>
          {comercio.destacado && (
            <span className="badge destacado">⭐ Destacado</span>
          )}
        </div>
      </div>
      
      <div className="card-content">
        <p><strong>Tipo:</strong> {comercio.tipoComercio}</p>
        <p><strong>Ciudad:</strong> {comercio.ciudad}</p>
        <p><strong>Registro:</strong> {new Date(comercio.createdAt).toLocaleDateString()}</p>
      </div>

      <div className="card-actions">
        {comercio.estado === 'pendiente' && (
          <button 
            className="btn-success" 
            onClick={handleAprobar}
          >
            Aprobar
          </button>
        )}
        
        {comercio.estado === 'activo' && (
          <>
            {comercio.destacado ? (
              <button 
                className="btn-warning" 
                onClick={() => handleDestacar(false)}
              >
                Quitar Destacado
              </button>
            ) : (
              <button 
                className="btn-primary" 
                onClick={() => handleDestacar(true)}
              >
                Destacar
              </button>
            )}
          </>
        )}
        
        <button className="btn-action">Ver Detalles</button>
      </div>
    </div>
  );
}