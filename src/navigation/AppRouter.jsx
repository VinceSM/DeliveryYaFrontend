// src/navigation/AppRouter.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthRouter from './AuthRouter';

function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Rutas de autenticación */}
        <Route path="/auth/*" element={<AuthRouter />} />
        
        {/* Ruta por defecto redirige a login */}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        
        {/* Ruta para cualquier otra dirección no definida */}
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;