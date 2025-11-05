// src/navigation/AuthRouter.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAdminAuth } from '../hooks/useAdminAuth'; // ✅ AGREGAR
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';

function AuthRouter() {
  const { isAuthenticated } = useAuth();
  const { isAdminAuthenticated } = useAdminAuth(); // ✅ AGREGAR

  // Si ya está autenticado como comercio, redirigir al dashboard
  if (isAuthenticated && !isAdminAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Si ya está autenticado como admin, redirigir al admin dashboard
  if (isAdminAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <Routes>
      <Route path="login" element={<LoginScreen />} />
      <Route path="register" element={<RegisterScreen />} />
      
      {/* Ruta por defecto dentro de auth redirige a login */}
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
}

export default AuthRouter;