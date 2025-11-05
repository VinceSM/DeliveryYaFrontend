import { useState } from 'react';
import PedidosFilters from './PedidosFilters';
import PedidosTable from './PedidosTable';

export default function GestionPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [filters, setFilters] = useState({
    estado: '',
    fecha: ''
  });

  return (
    <div className="section-container">
      <div className="section-header">
        <h2>Gestión de Pedidos</h2>
        <PedidosFilters filters={filters} onFiltersChange={setFilters} />
      </div>
      <PedidosTable pedidos={pedidos} />
    </div>
  );
}