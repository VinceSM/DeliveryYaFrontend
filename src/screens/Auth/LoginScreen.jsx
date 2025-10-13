import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { checkBackendConnection } from "../../api/auth"; // ✅ AGREGAR ESTA IMPORTACIÓN
import LogoDeliveryYa from "../../assets/LogoDeliveryYa.png";
import "../../styles/screens/LoginScreen.css";

export default function LoginScreen() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, error: authError, clearError } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Limpiar errores cuando el usuario empiece a escribir
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
      console.log('🔐 Intentando login con:', { email: form.email });
      
      // Verificar conexión primero
      const isConnected = await checkBackendConnection();
      if (!isConnected) {
        throw new Error('No se puede conectar con el servidor. Verifica que el backend esté ejecutándose.');
      }
      
      // El hook useAuth maneja el login
      const result = await login({
        email: form.email,
        password: form.password
      });
      
      console.log('✅ Login exitoso, respuesta completa:', result);
      alert("✅ Inicio de sesión exitoso");
      navigate("/dashboard");
      
    } catch (error) {
      console.error('❌ Error completo en login:', error);
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
          <h1 className="login-title">Iniciar Sesión</h1>
          <p className="login-subtitle">Accede a tu panel de comercio</p>
        </div>
        
        {/* Mostrar errores */}
        {(error || authError) && (
          <div className="login-error">
            {error || authError}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-input-group">
            <label className="login-form-label">Email</label>
            <input 
              className="login-form-input"
              name="email" 
              type="email" 
              value={form.email}
              placeholder="ejemplo@correo.com" 
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
          
          <div className="login-options">
            <label className="login-remember">
              <input type="checkbox" disabled={loading} />
              <span className="login-checkmark"></span>
              Recordarme
            </label>
            <a href="#" className="login-forgot">¿Olvidaste tu contraseña?</a>
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>
        
        <div className="login-footer">
          <p className="login-register-text">
            ¿No tienes una cuenta?{" "}
            <Link to="/auth/register" className="login-register-link">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}