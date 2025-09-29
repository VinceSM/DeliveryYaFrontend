// src/navigation/AppRouter.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthRouter from './AuthRouter';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';

function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Rutas de autenticación */}
        <Route path="/auth/*" element={<AuthRouter />} />

        {/* Ruta del Dashboard del comercio */}
        <Route path="/dashboard/*" element={<DashboardScreen />} />

        {/* Ruta por defecto redirige a login */}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />

        {/* Ruta para cualquier otra dirección no definida */}
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
