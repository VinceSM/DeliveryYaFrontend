import { useAdminAuth } from '../../../hooks/useAdminAuth';

const sections = {
  dashboard: 'Dashboard',
  pedidos: 'Pedidos',
  clientes: 'Clientes',
  comercios: 'Comercios',
  repartidores: 'Repartidores',
  categorias: 'Categorías',
  reportes: 'Reportes'
};

export default function AdminSidebar({ activeSection, onSectionChange }) {
  const { admin, logout } = useAdminAuth();

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <h2>DeliveryYa Admin</h2>
        <p>Bienvenido, {admin?.usuario}</p>
      </div>
      
      <nav className="sidebar-nav">
        {Object.entries(sections).map(([key, value]) => (
          <button
            key={key}
            className={`nav-item ${activeSection === key ? 'active' : ''}`}
            onClick={() => onSectionChange(key)}
          >
            {value}
          </button>
        ))}
      </nav>
      
      <button className="logout-btn" onClick={logout}>
        Cerrar Sesión
      </button>
    </div>
  );
}