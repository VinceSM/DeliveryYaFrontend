export default function CategoriaCard({ categoria, onEdit, onDelete, onToggleEstado }) {
  return (
    <div className={`categoria-card ${categoria.estado === 'inactivo' ? 'inactive' : ''}`}>
      <div className="categoria-header">
        <div className="categoria-info">
          <h4>{categoria.nombre}</h4>
          <span className="productos-count">
            {categoria.cantidadProductos || 0} productos
          </span>
        </div>
        <span className={`estado-badge ${categoria.estado}`}>
          {categoria.estado === 'activo' ? 'Activo' : 'Inactivo'}
        </span>
      </div>
      
      <div className="categoria-actions">
        <button 
          className="btn-action"
          onClick={() => onEdit(categoria)}
        >
          Editar
        </button>
        <button 
          className="btn-action btn-danger"
          onClick={() => onDelete(categoria.idcategoria)}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}