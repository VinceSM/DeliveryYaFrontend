// src/screens/Auth/RegisterScreen.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { registerComercio } from "../../api/auth";
import LogoDeliveryYa from "../../assets/LogoDeliveryYa.png";
import "../../styles/screens/RegisterScreen.css";

export default function RegisterScreen() {
  const [currentSection, setCurrentSection] = useState(0);
  const [form, setForm] = useState({
    nombreComercio: "",
    email: "",
    password: "",
    fotoPortada: "",
    celular: "",
    ciudad: "",
    calle: "",
    numero: "",
    latitud: "",
    longitud: "",
    encargado: "",
    cvu: "",
    alias: "",
    destacado: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerComercio(form);
      alert("✅ " + response.Message);
      // Redirigir al login después del registro exitoso
      window.location.href = "/auth/login";
    } catch (error) {
      alert("❌ " + error.message);
    }
  };

  const nextSection = () => {
    setCurrentSection(prev => prev + 1);
  };

  const prevSection = () => {
    setCurrentSection(prev => prev - 1);
  };

  const sectionTitles = ["Información", "Dirección", "Contrato"];
  
  return (
    <div className="register-container">
      <div className="register-header">
        <img src={LogoDeliveryYa} alt="Logo DeliveryYa" className="register-logo" />
        
        {/* Enlace para volver al login */}
        <div style={{textAlign: 'right', marginBottom: '10px'}}>
          <Link 
            to="/auth/login"
            style={{color: '#fff', textDecoration: 'none', fontSize: '14px'}}
          >
            ← Volver al Login
          </Link>
        </div>
        
        <h1 className="register-title">Registro de Comercio</h1>
        
        {/* Indicador de progreso mejorado */}
        <div className="register-progress-indicator">
          {sectionTitles.map((title, index) => (
            <div key={index} className={`register-progress-step ${index === currentSection ? 'register-active' : ''} ${index < currentSection ? 'register-completed' : ''}`}>
              <div className="register-step-number">{index + 1}</div>
              <div className="register-step-title">{title}</div>
            </div>
          ))}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="register-form">
        {/* SECCIÓN 1: INFORMACIÓN */}
        {currentSection === 0 && (
          <div className="register-form-section">
            <h2 className="register-section-title">Información del Comercio</h2>
            <div className="register-form-grid">
              <div className="register-input-group">
                <label className="register-form-label">Nombre del comercio *</label>
                <input 
                  className="register-form-input"
                  name="nombreComercio" 
                  value={form.nombreComercio}
                  placeholder="Ej: Mi Restaurante" 
                  onChange={handleChange} 
                  required
                />
              </div>
              
              <div className="register-input-group">
                <label className="register-form-label">Email *</label>
                <input 
                  className="register-form-input"
                  name="email" 
                  type="email" 
                  value={form.email}
                  placeholder="ejemplo@correo.com" 
                  onChange={handleChange} 
                  required
                />
              </div>
              
              <div className="register-input-group">
                <label className="register-form-label">Contraseña *</label>
                <input 
                  className="register-form-input"
                  name="password" 
                  type="password" 
                  value={form.password}
                  placeholder="Mínimo 8 caracteres" 
                  onChange={handleChange} 
                  required
                />
              </div>
              
              <div className="register-input-group">
                <label className="register-form-label">Encargado</label>
                <input 
                  className="register-form-input"
                  name="encargado" 
                  value={form.encargado}
                  placeholder="Nombre del encargado" 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="register-input-group">
                <label className="register-form-label">Celular</label>
                <input 
                  className="register-form-input"
                  name="celular" 
                  value={form.celular}
                  placeholder="+54 9 11 1234-5678" 
                  onChange={handleChange} 
                />
              </div>
            </div>
            
            <div className="register-navigation-buttons">
              <button type="button" className="register-nav-button register-next-button" onClick={nextSection}>
                Siguiente → Dirección
              </button>
            </div>
          </div>
        )}
        
        {/* SECCIÓN 2: DIRECCIÓN */}
        {currentSection === 1 && (
          <div className="register-form-section">
            <h2 className="register-section-title">Dirección del Comercio</h2>
            <div className="register-form-grid">
              <div className="register-input-group">
                <label className="register-form-label">Ciudad *</label>
                <input 
                  className="register-form-input"
                  name="ciudad" 
                  value={form.ciudad}
                  placeholder="Ciudad" 
                  onChange={handleChange} 
                  required
                />
              </div>
              
              <div className="register-input-group">
                <label className="register-form-label">Calle *</label>
                <input 
                  className="register-form-input"
                  name="calle" 
                  value={form.calle}
                  placeholder="Calle" 
                  onChange={handleChange} 
                  required
                />
              </div>
              
              <div className="register-input-group">
                <label className="register-form-label">Número *</label>
                <input 
                  className="register-form-input"
                  name="numero" 
                  value={form.numero}
                  placeholder="Número" 
                  onChange={handleChange} 
                  required
                />
              </div>
              
              <div className="register-input-group">
                <label className="register-form-label">Latitud</label>
                <input 
                  className="register-form-input"
                  name="latitud" 
                  type="number" 
                  step="any"
                  value={form.latitud}
                  placeholder="Ej: -34.603722" 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="register-input-group">
                <label className="register-form-label">Longitud</label>
                <input 
                  className="register-form-input"
                  name="longitud" 
                  type="number" 
                  step="any"
                  value={form.longitud}
                  placeholder="Ej: -58.381592" 
                  onChange={handleChange} 
                />
              </div>
            </div>
            
            <div className="register-navigation-buttons">
              <button type="button" className="register-nav-button register-prev-button" onClick={prevSection}>
                ← Anterior
              </button>
              <button type="button" className="register-nav-button register-next-button" onClick={nextSection}>
                Siguiente → Contrato
              </button>
            </div>
          </div>
        )}
        
        {/* SECCIÓN 3: CONTRATO */}
        {currentSection === 2 && (
          <div className="register-form-section">
            <h2 className="register-section-title">Selecciona tu Plan</h2>
            <div className="register-contract-options">
              <div className="register-contract-option">
                <div className="register-option-header">
                  <h3>Plan Básico</h3>
                  <p className="register-price">$0<span>/mes</span></p>
                </div>
                <ul className="register-features-list">
                  <li>✔ Presencia en el directorio</li>
                  <li>✔ Gestión de pedidos básica</li>
                  <li>✔ Soporte por email</li>
                  <li>✖ Destacado en búsquedas</li>
                  <li>✖ Promociones destacadas</li>
                </ul>
                <div className="register-radio-container">
                  <input 
                    type="radio" 
                    name="destacado" 
                    checked={!form.destacado} 
                    onChange={() => setForm(prev => ({...prev, destacado: false}))} 
                    id="plan-basico"
                  />
                  <label htmlFor="plan-basico" className="register-radio-label">
                    Seleccionar Plan Básico
                  </label>
                </div>
              </div>
              
              <div className="register-contract-option register-highlighted">
                <div className="register-option-header">
                  <h3>Plan Destacado</h3>
                  <p className="register-price">$2990<span>/mes</span></p>
                </div>
                <ul className="register-features-list">
                  <li>✔ Todo lo del Plan Básico</li>
                  <li>✔ Destacado en búsquedas</li>
                  <li>✔ Promociones destacadas</li>
                  <li>✔ Soporte prioritario 24/7</li>
                  <li>✔ Estadísticas avanzadas</li>
                </ul>
                <div className="register-radio-container">
                  <input 
                    type="radio" 
                    name="destacado" 
                    checked={form.destacado} 
                    onChange={() => setForm(prev => ({...prev, destacado: true}))} 
                    id="plan-destacado"
                  />
                  <label htmlFor="plan-destacado" className="register-radio-label">
                    Seleccionar Plan Destacado
                  </label>
                </div>
              </div>
            </div>
            
            <div className="register-navigation-buttons">
              <button type="button" className="register-nav-button register-prev-button" onClick={prevSection}>
                ← Anterior
              </button>
              <button type="submit" className="register-register-button">
                Registrar Comercio
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}