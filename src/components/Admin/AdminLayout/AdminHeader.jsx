const sections = {
  dashboard: 'Dashboard',
  pedidos: 'Pedidos',
  clientes: 'Clientes',
  comercios: 'Comercios',
  repartidores: 'Repartidores',
  categorias: 'Categorías',
  estadosPedido: 'Estados Pedido',
  metodosPago: 'Métodos Pago',
  reportes: 'Reportes'
};

export default function AdminHeader({ activeSection }) {
  return (
    <header className="admin-header">
      <h1>{sections[activeSection]}</h1>
      <div className="header-actions">
        <span>{new Date().toLocaleDateString('es-ES')}</span>
      </div>
    </header>
  );
}