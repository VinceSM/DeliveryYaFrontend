// src/navigation/AppRouter.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAdminAuth } from '../hooks/useAdminAuth';
import AuthRouter from './AuthRouter';
import AdminRouter from './AdminRouter';
import GestionCategoriasScreen from '../screens/Categorias/GestionCategoriasScreen.jsx';
import GestionCategoriasComercioScreen from '../screens/Categorias/GestionCategoriasComercioScreen.jsx'; // ✅ NUEVO
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import PedidosScreen from '../screens/Pedidos/PedidosScreen';
import ProductosScreen from '../screens/Productos/ProductosScreen.jsx';
import CrearProductoScreen from '../screens/Productos/CrearProductoScreen.jsx';
import EditarProductoScreen from '../screens/Productos/EditarProductoScreen.jsx';
import VerProductoScreen from '../screens/Productos/VerProductoScreen.jsx';
import HorariosScreen from '../screens/Horarios/HorariosScreen';
import PerfilScreen from '../screens/Perfil/PerfilScreen';

function AppRouter() {
  const { isAuthenticated, loading } = useAuth();
  const { isAdminAuthenticated, loading: adminLoading } = useAdminAuth();

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
      
      {/* Rutas de admin */}
      <Route path="/admin/*" element={<AdminRouter />} />

      {/* Rutas protegidas de comercio */}
      {isAuthenticated && !isAdminAuthenticated ? (
        <>
          <Route path="/dashboard" element={<DashboardScreen />} />
          
          {/* ✅ RUTAS DE PRODUCTOS */}
          <Route path="/productos" element={<ProductosScreen />} />
          <Route path="/productos/crear" element={<CrearProductoScreen />} />
          <Route path="/productos/editar/:id" element={<EditarProductoScreen />} />
          <Route path="/productos/ver/:id" element={<VerProductoScreen />} />
          
          {/* ✅ RUTAS DE CATEGORÍAS */}
          <Route path="/categorias" element={<GestionCategoriasScreen />} />
          <Route path="/categorias-comercio" element={<GestionCategoriasComercioScreen />} /> {/* ✅ NUEVA RUTA */}
          
          <Route path="/pedidos" element={<PedidosScreen />} />
          <Route path="/horarios" element={<HorariosScreen />} />
          <Route path="/perfil" element={<PerfilScreen />} />
          
          {/* Redirigir raíz a dashboard si está autenticado como comercio */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Ruta por defecto para comercio */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </>
      ) : (
        // Si no está autenticado como comercio Y no es admin, redirigir a login de comercio
        !isAdminAuthenticated && <Route path="*" element={<Navigate to="/auth/login" replace />} />
      )}
    </Routes>
  );
}

export default AppRouter;