import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { checkBackendConnection } from "../../api/auth";
import LogoDeliveryYa from "../../assets/LogoDeliveryYa.png";
import "../../styles/screens/LoginScreen.css";

export default function AdminLoginScreen() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, error: authError, clearError } = useAdminAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    if (error || authError) {
      setError("");
      clearError?.();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    clearError?.();
    
    try {
      console.log('🔐 Intentando login de admin con:', { email: form.email });
      
      // Verificar conexión primero
      const isConnected = await checkBackendConnection();
      if (!isConnected) {
        throw new Error('No se puede conectar con el servidor. Verifica que el backend esté ejecutándose.');
      }
      
      const result = await login({
        email: form.email,
        password: form.password
      });
      
      console.log('✅ Login de admin exitoso, respuesta completa:', result);
      alert("✅ Inicio de sesión como administrador exitoso");
      navigate("/admin/dashboard");
      
    } catch (error) {
      console.error('❌ Error completo en login de admin:', error);
      setError(error.message);
      alert("❌ Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src={LogoDeliveryYa} alt="Logo DeliveryYa" className="login-logo" />
          <h1 className="login-title">Admin - Iniciar Sesión</h1>
          <p className="login-subtitle">Accede al panel de administración</p>
        </div>
        
        {(error || authError) && (
          <div className="login-error">
            {error || authError}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-input-group">
            <label className="login-form-label">Email Admin</label>
            <input 
              className="login-form-input"
              name="email" 
              type="email" 
              value={form.email}
              placeholder="admin@deliveryya.com" 
              onChange={handleChange} 
              required
              disabled={loading}
            />
          </div>
          
          <div className="login-input-group">
            <label className="login-form-label">Contraseña</label>
            <input 
              className="login-form-input"
              name="password" 
              type="password" 
              value={form.password}
              placeholder="Ingresa tu contraseña" 
              onChange={handleChange} 
              required
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión como Admin"}
          </button>
        </form>
        
        <div className="login-footer">
          <p className="login-register-text">
            <a href="/auth/login" className="login-register-link">
              ¿Eres comercio? Inicia sesión aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}