// src/screens/Auth/LoginScreen.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginComercio } from "../../api/auth";
import LogoDeliveryYa from "../../assets/LogoDeliveryYa.png";
import "../../styles/screens/LoginScreen.css";

export default function LoginScreen() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // 👈 Hook de navegación

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await loginComercio(form);

      // Guardamos token y comercio simulado en localStorage
      localStorage.setItem("token", response.Token);
      localStorage.setItem("comercio", JSON.stringify(response.Comercio));

      alert("✅ " + response.Message);

      // Redirigir al dashboard
      navigate("/dashboard");
    } catch (error) {
      alert("❌ " + error.message);
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
            />
          </div>
          
          <div className="login-options">
            <label className="login-remember">
              <input type="checkbox" />
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
