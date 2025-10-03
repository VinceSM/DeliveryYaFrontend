import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthRouter from './AuthRouter';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import PedidosScreen from '../screens/Pedidos/PedidosScreen';
import ProductosScreen from '../screens/Productos/ProductosScreen';
import EditarProductoScreen from '../screens/Productos/EditarProductoScreen';
import HorariosScreen from '../screens/Horarios/HorariosScreen';
import PerfilScreen from '../screens/Perfil/PerfilScreen';

function AppRouter() {
  const { isAuthenticated, loading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Cargando...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Rutas de autenticación (siempre accesibles) */}
      <Route path="/auth/*" element={<AuthRouter />} />

      {/* Rutas protegidas - solo accesibles si está autenticado */}
      {isAuthenticated ? (
        <>
          <Route path="/dashboard" element={<DashboardScreen />} />
          <Route path="/productos" element={<ProductosScreen />} />
          <Route path="/productos/nuevo" element={<EditarProductoScreen />} />
          <Route path="/productos/editar/:id" element={<EditarProductoScreen />} />
          <Route path="/pedidos" element={<PedidosScreen />} />
          <Route path="/horarios" element={<HorariosScreen />} />
          <Route path="/perfil" element={<PerfilScreen />} />
          
          {/* Redirigir raíz a dashboard si está autenticado */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </>
      ) : (
        // Si no está autenticado, redirigir todo a login
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      )}
    </Routes>
  );
}

export default AppRouter;