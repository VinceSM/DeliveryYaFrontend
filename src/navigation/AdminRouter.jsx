// src/navigation/AdminRouter.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';
import AdminLoginScreen from '../screens/Admin/AdminLoginScreen';
import AdminDashboardScreen from '../screens/Admin/AdminDashboardScreen';

function AdminRouter() {
  const { isAdminAuthenticated } = useAdminAuth();

  return (
    <Routes>
      {/* Si está autenticado como admin */}
      {isAdminAuthenticated ? (
        <>
          <Route path="dashboard" element={<AdminDashboardScreen />} />
          {/* Agrega más rutas de admin aquí */}
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </>
      ) : (
        /* Si no está autenticado como admin */
        <>
          <Route path="login" element={<AdminLoginScreen />} />
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </>
      )}
    </Routes>
  );
}

export default AdminRouter;