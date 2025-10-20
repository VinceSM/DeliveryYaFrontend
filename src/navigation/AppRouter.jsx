import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAdminAuth } from '../hooks/useAdminAuth'; // ✅ NUEVO
import AuthRouter from './AuthRouter';
import AdminRouter from './AdminRouter'; // ✅ NUEVO - Lo crearemos después
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import PedidosScreen from '../screens/Pedidos/PedidosScreen';
import ProductosScreen from '../screens/Productos/ProductosScreen';
import EditarProductoScreen from '../screens/Productos/EditarProductoScreen';
import HorariosScreen from '../screens/Horarios/HorariosScreen';
import PerfilScreen from '../screens/Perfil/PerfilScreen';

function AppRouter() {
  const { isAuthenticated, loading } = useAuth();
  const { isAdminAuthenticated, loading: adminLoading } = useAdminAuth(); // ✅ NUEVO

  // Mostrar loading mientras se verifica la autenticación
  if (loading || adminLoading) {
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
      {/* Rutas de autenticación de comercio */}
      <Route path="/auth/*" element={<AuthRouter />} />
      
      {/* ✅ NUEVO: Rutas de admin */}
      <Route path="/admin/*" element={<AdminRouter />} />

      {/* Rutas protegidas de comercio */}
      {isAuthenticated && !isAdminAuthenticated ? (
        <>
          <Route path="/dashboard" element={<DashboardScreen />} />
          <Route path="/productos" element={<ProductosScreen />} />
          <Route path="/productos/nuevo" element={<EditarProductoScreen />} />
          <Route path="/productos/editar/:id" element={<EditarProductoScreen />} />
          <Route path="/pedidos" element={<PedidosScreen />} />
          <Route path="/horarios" element={<HorariosScreen />} />
          <Route path="/perfil" element={<PerfilScreen />} />
          
          {/* Redirigir raíz a dashboard si está autenticado como comercio */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </>
      ) : (
        // Si no está autenticado como comercio Y no es admin, redirigir a login de comercio
        !isAdminAuthenticated && <Route path="*" element={<Navigate to="/auth/login" replace />} />
      )}
    </Routes>
  );
}

export default AppRouter;