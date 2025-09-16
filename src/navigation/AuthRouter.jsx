// src/navigation/AuthRouter.jsx
import { Routes, Route } from 'react-router-dom';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';

function AuthRouter() {
  return (
    <Routes>
      <Route path="login" element={<LoginScreen />} />
      <Route path="register" element={<RegisterScreen />} />
      
      {/* Ruta por defecto dentro de auth redirige a login */}
      <Route path="*" element={<LoginScreen />} />
    </Routes>
  );
}

export default AuthRouter;