import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthRouter from './AuthRouter';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import PedidosScreen from '../screens/Pedidos/PedidosScreen';
import ProductosScreen from '../screens/Productos/ProductosScreen';
import HorariosScreen from '../screens/Horarios/HorariosScreen';
import PerfilScreen from '../screens/Perfil/PerfilScreen';

function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Rutas de autenticación */}
        <Route path="/auth/*" element={<AuthRouter />} />

        {/* Ruta del Dashboard del comercio */}
        <Route path="/dashboard" element={<DashboardScreen />} />

        {/* Rutas específicas para cada sección */}
        <Route path="/pedidos" element={<PedidosScreen />} />
        <Route path="/productos" element={<ProductosScreen />} />
        <Route path="/horarios" element={<HorariosScreen />} />
        <Route path="/perfil" element={<PerfilScreen />} />

        {/* Ruta por defecto redirige a login */}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />

        {/* Ruta para cualquier otra dirección no definida */}
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;