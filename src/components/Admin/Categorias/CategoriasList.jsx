import CategoriaCard from './CategoriaCard';

export default function CategoriasList({ categorias, onEdit, onDelete, onToggleEstado }) {
  if (categorias.length === 0) {
    return (
      <div className="empty-state">
        <p>No hay categorías creadas</p>
      </div>
    );
  }

  return (
    <div className="categorias-grid">
      {categorias.map(categoria => (
        <CategoriaCard
          key={categoria.idcategoria}
          categoria={categoria}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleEstado={onToggleEstado}
        />
      ))}
    </div>
  );
}