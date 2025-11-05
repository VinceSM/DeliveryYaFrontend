export default function PedidosFilters({ filters, onFiltersChange }) {
  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="filters">
      <select 
        value={filters.estado} 
        onChange={(e) => handleFilterChange('estado', e.target.value)}
      >
        <option value="">Todos los estados</option>
        <option value="pendiente">Pendiente</option>
        <option value="preparacion">En preparación</option>
        <option value="camino">En camino</option>
        <option value="entregado">Entregado</option>
        <option value="cancelado">Cancelado</option>
      </select>
      <input 
        type="date" 
        value={filters.fecha}
        onChange={(e) => handleFilterChange('fecha', e.target.value)}
      />
    </div>
  );
}