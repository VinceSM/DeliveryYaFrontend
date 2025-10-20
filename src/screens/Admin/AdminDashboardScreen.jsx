import { useAdminAuth } from '../../hooks/useAdminAuth';

export default function AdminDashboardScreen() {
  const { admin, logout } = useAdminAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Panel de Administración</h1>
      <p>Bienvenido, {admin?.nombre}!</p>
      <p>Email: {admin?.email}</p>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Funciones de Admin:</h2>
        <ul>
          <li>Gestión de comercios</li>
          <li>Reportes y estadísticas</li>
          <li>Configuración del sistema</li>
        </ul>
      </div>
      
      <button 
        onClick={handleLogout}
        style={{ 
          marginTop: '20px', 
          padding: '10px 20px', 
          backgroundColor: '#ff4444', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px' 
        }}
      >
        Cerrar Sesión
      </button>
    </div>
  );
}