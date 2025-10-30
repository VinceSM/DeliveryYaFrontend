// src/screens/Auth/RegisterScreen.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { registerComercio } from "../../api/auth";
import LogoDeliveryYa from "../../assets/LogoDeliveryYa.png";
import "../../styles/screens/RegisterScreen.css";
import MapSelector from "../../components/MapSelector.jsx";

// Coordenadas por defecto de Miramar, Buenos Aires
const MIRAMAR_COORDINATES = {
  lat: -38.270510,
  lng: -57.839651
};

export default function RegisterScreen() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [fileName, setFileName] = useState("");
  
  // Estado con valores por defecto
  const [form, setForm] = useState({
    nombreComercio: "",
    email: "",
    password: "",
    fotoPortada: "",
    tipoComercio: "",
    celular: "",
    ciudad: "Miramar",
    calle: "",
    numero: "",
    latitud: "",
    longitud: "",
    encargado: "",
    cvu: "",
    alias: "",
    destacado: false,
    deliveryPropio: true,
  });

  const handleMapLocationSelect = (lat, lng) => {
    setForm(prev => ({
      ...prev,
      latitud: lat.toString(),
      longitud: lng.toString()
    }));
    
    // Limpiar errores de coordenadas si existían
    if (formErrors.latitud || formErrors.longitud) {
      setFormErrors(prev => ({
        ...prev,
        latitud: "",
        longitud: ""
      }));
    }
  };

  // Limpiar coordenadas (hacerlas null)
  const clearCoordinates = () => {
    setForm(prev => ({
      ...prev,
      latitud: "",
      longitud: ""
    }));
  };

  // Agrega esta función para manejar la selección de archivos
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        alert('❌ Por favor selecciona un archivo de imagen válido');
        return;
      }
      
      // Validar tamaño (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('❌ La imagen es demasiado grande. Máximo 5MB permitido');
        return;
      }
      
      // Guardar el nombre del archivo
      setFileName(file.name); // ← Agrega esta línea
      
      // Crear URL temporal para vista previa
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);      
      console.log('📸 Imagen seleccionada:', file.name);
    }
  };

  // Función para limpiar la imagen seleccionada
  const clearImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setFileName(""); // ← Agrega esta línea
    setForm(prev => ({ ...prev, fotoPortada: "" }));
    
    // Resetear el input file
    const fileInput = document.getElementById('fotoPortadaUpload');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateSection = (section) => {
    const errors = {};
    
    if (section === 0) {
      if (!form.nombreComercio?.trim()) errors.nombreComercio = "El nombre del comercio es requerido";
      if (!form.email?.trim()) errors.email = "El email es requerido";
      else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = "El email no es válido";
      if (!form.password) errors.password = "La contraseña es requerida";
      else if (form.password.length < 6) errors.password = "La contraseña debe tener al menos 6 caracteres";
      if (form.tipoComercio.length > 250) errors.tipoComercio = "La descripción no puede exceder los 250 caracteres";
      if (!form.encargado?.trim()) errors.encargado = "El encargado es requerido";
      if (!form.celular?.trim()) errors.celular = "El celular es requerido";
      if (!form.cvu?.trim()) errors.cvu = "El CVU es requerido";
      if (!form.alias?.trim()) errors.alias = "El alias es requerido";
      if (!form.deliveryPropio && errors.deliveryPropio !== false) errors.deliveryPropio = "Debes seleccionar una opción de delivery";
    }
    
    if (section === 1) {
      if (!form.ciudad?.trim()) errors.ciudad = "La ciudad es requerida";
      if (!form.calle?.trim()) errors.calle = "La calle es requerida";
      if (!form.numero?.trim()) errors.numero = "El número es requerido";
      else if (isNaN(form.numero)) errors.numero = "El número debe ser un valor numérico";
      // if (!form.latitud) errors.latitud = "La latitud es requerida";
      // else if (isNaN(form.latitud)) errors.latitud = "La latitud debe ser un número";
      // if (!form.longitud) errors.longitud = "La longitud es requerida";
      // else if (isNaN(form.longitud)) errors.longitud = "La longitud debe ser un número";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextSection = () => {
    if (validateSection(currentSection)) {
      setCurrentSection(prev => prev + 1);
    }
  };

  const prevSection = () => {
    setCurrentSection(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar la sección actual
    if (!validateSection(currentSection)) {
      alert("❌ Por favor corrige los errores en el formulario");
      return;
    }

    setIsLoading(true);
    
    try {
      // Preparar datos con conversión explícita de tipos
      const comercioData = {
        NombreComercio: String(form.nombreComercio || ""),
        Email: String(form.email || ""),
        Password: String(form.password || ""),
        FotoPortada: String(form.fotoPortada || ""),
        tipoComercio: String(form.tipoComercio || ""),
        Celular: String(form.celular || ""),
        Ciudad: String(form.ciudad || ""),
        Calle: String(form.calle || ""),
        Numero: Number(form.numero) || 0,
        Latitud: form.latitud ? Number(form.latitud) : 0,
        Longitud: form.longitud ? Number(form.longitud) : 0,
        Encargado: String(form.encargado || ""),
        Cvu: String(form.cvu || ""),
        Alias: String(form.alias || ""),
        Destacado: Boolean(form.destacado),
        DeliveryPropio: Boolean(form.deliveryPropio),
      };

      console.log('📤 Estado del formulario:', form);
      console.log('📤 Datos procesados para enviar:', comercioData);
      
      const response = await registerComercio(comercioData);
      console.log('✅ Registro exitoso:', response);
      
      alert("✅ Comercio registrado exitosamente");
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("❌ Error en registro:", error);
      
      // Mostrar error más amigable
      let errorMessage = "Error al registrar el comercio";
      try {
        const errorData = JSON.parse(error.message);
        if (errorData.errors) {
          const errorList = Object.values(errorData.errors).flat().join(', ');
          errorMessage = `Errores de validación: ${errorList}`;
        }
      } catch {
        errorMessage = error.message;
      }
      
      alert("❌ " + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitialMapPosition = () => {
    if (form.latitud && form.longitud) {
      return [parseFloat(form.latitud), parseFloat(form.longitud)];
    }
    return [MIRAMAR_COORDINATES.lat, MIRAMAR_COORDINATES.lng];
  };

  const sectionTitles = ["Información", "Dirección", "Contrato"];
  
  return (
    <div className="register-container">
      <div className="register-header">
        <img src={LogoDeliveryYa} alt="Logo DeliveryYa" className="register-logo" />
        
        <div style={{textAlign: 'right', marginBottom: '10px'}}>
          <Link to="/auth/login" style={{color: '#fff', textDecoration: 'none', fontSize: '14px'}}>
            ← Volver al Login
          </Link>
        </div>
        
        <h1 className="register-title">Registro de Comercio</h1>
        
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
                  className={`register-form-input ${formErrors.nombreComercio ? 'error' : ''}`}
                  name="nombreComercio" 
                  value={form.nombreComercio}
                  placeholder="Ej: Mi Restaurante" 
                  onChange={handleChange} 
                />
                {formErrors.nombreComercio && <span className="error-message">{formErrors.nombreComercio}</span>}
              </div>

              <div className="register-input-group">
                <label className="register-form-label">Celular del Comercio *</label>
                <input 
                  className={`register-form-input ${formErrors.celular ? 'error' : ''}`}
                  name="celular" 
                  value={form.celular}
                  placeholder="+54 9 11 1234-5678" 
                  onChange={handleChange} 
                />
                {formErrors.celular && <span className="error-message">{formErrors.celular}</span>}
              </div>

              <div className="register-input-group">
                <label className="register-form-label">Tipo de Comercio *</label>
                <select 
                  className={`register-form-input ${formErrors.tipoComercio ? 'error' : ''}`}
                  name="tipoComercio" 
                  value={form.tipoComercio}
                  onChange={handleChange}
                >
                  <option value="">Selecciona el tipo de comercio</option>
                  <option value="Restaurante">Restaurante</option>
                  <option value="Cafetería">Cafetería</option>
                  <option value="Supermercado">Supermercado</option>
                  {/* ... otras opciones ... */}
                </select>
                {formErrors.tipoComercio && <span className="error-message">{formErrors.tipoComercio}</span>}
              </div>

              <div className="register-input-group">
                <label className="register-form-label">Email *</label>
                <input 
                  className={`register-form-input ${formErrors.email ? 'error' : ''}`}
                  name="email" 
                  type="email" 
                  value={form.email}
                  placeholder="ejemplo@correo.com" 
                  onChange={handleChange} 
                />
                {formErrors.email && <span className="error-message">{formErrors.email}</span>}
              </div>
              
              <div className="register-input-group">
                <label className="register-form-label">Contraseña *</label>
                <input 
                  className={`register-form-input ${formErrors.password ? 'error' : ''}`}
                  name="password" 
                  type="password" 
                  value={form.password}
                  placeholder="Mínimo 6 caracteres" 
                  onChange={handleChange} 
                />
                {formErrors.password && <span className="error-message">{formErrors.password}</span>}
              </div>

              

              <div className="register-input-group">
                <label className="register-form-label">Delivery</label>
                <div className="radio-group">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="deliveryPropio"
                      value="true"
                      checked={form.deliveryPropio === true}
                      onChange={() => setForm(prev => ({ ...prev, deliveryPropio: true }))}
                    />
                    <span className="radio-label">✅ Tengo delivery propio</span>
                  </label>
                  
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="deliveryPropio"
                      value="false"
                      checked={form.deliveryPropio === false}
                      onChange={() => setForm(prev => ({ ...prev, deliveryPropio: false }))}
                    />
                    <span className="radio-label">❌ No tengo delivery propio</span>
                  </label>
                </div>
              </div>
              
              <div className="register-input-group">
                <label className="register-form-label">Encargado *</label>
                <input 
                  className={`register-form-input ${formErrors.encargado ? 'error' : ''}`}
                  name="encargado" 
                  value={form.encargado}
                  placeholder="Nombre del encargado" 
                  onChange={handleChange} 
                />
                {formErrors.encargado && <span className="error-message">{formErrors.encargado}</span>}
              </div>
              
              

              <div className="register-input-group">
                <label className="register-form-label">CVU *</label>
                <input 
                  className={`register-form-input ${formErrors.cvu ? 'error' : ''}`}
                  name="cvu" 
                  value={form.cvu}
                  placeholder="CVU bancario (22 dígitos)" 
                  onChange={handleChange} 
                />
                {formErrors.cvu && <span className="error-message">{formErrors.cvu}</span>}
              </div>

              <div className="register-input-group">
                <label className="register-form-label">Alias *</label>
                <input 
                  className={`register-form-input ${formErrors.alias ? 'error' : ''}`}
                  name="alias" 
                  value={form.alias}
                  placeholder="Alias bancario" 
                  onChange={handleChange} 
                />
                {formErrors.alias && <span className="error-message">{formErrors.alias}</span>}
              </div>

              <div className="register-input-group">
                <label className="register-form-label">Foto de portada</label>
                
                <div className="image-upload-container">
                  {!fileName && !form.fotoPortada ? (
                    <div className="image-upload-area">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="image-file-input"
                        id="fotoPortadaUpload"
                      />
                      <label htmlFor="fotoPortadaUpload" className="image-upload-label">
                        <div className="upload-icon">📸</div>
                        {/* <div className="upload-text">
                          <strong>Seleccionar imagen</strong>
                          <span>Haz clic para elegir una imagen</span>
                          <small>Formatos: JPG, PNG, WEBP (Max. 5MB)</small>
                        </div> */}
                      </label>
                    </div>
                  ) : (
                    <div className="file-selected-container">
                      <div className="file-info">
                        <span className="file-icon">📷</span>
                        <div className="file-details">
                          <span className="file-name">{fileName}</span>
                          <span className="file-status">✅ Imagen seleccionada</span>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        className="remove-file-btn"
                        onClick={clearImage}
                        title="Eliminar imagen"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
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
                  className={`register-form-input ${formErrors.ciudad ? 'error' : ''}`}
                  name="ciudad" 
                  value={form.ciudad}
                  placeholder="Ciudad" 
                  onChange={handleChange} 
                />
                {formErrors.ciudad && <span className="error-message">{formErrors.ciudad}</span>}
              </div>
              
              <div className="register-input-group">
                <label className="register-form-label">Calle *</label>
                <input 
                  className={`register-form-input ${formErrors.calle ? 'error' : ''}`}
                  name="calle" 
                  value={form.calle}
                  placeholder="Calle" 
                  onChange={handleChange} 
                />
                {formErrors.calle && <span className="error-message">{formErrors.calle}</span>}
              </div>
              
              <div className="register-input-group">
                <label className="register-form-label">Número *</label>
                <input 
                  className={`register-form-input ${formErrors.numero ? 'error' : ''}`}
                  name="numero" 
                  value={form.numero}
                  placeholder="Número" 
                  onChange={handleChange} 
                />
                {formErrors.numero && <span className="error-message">{formErrors.numero}</span>}
              </div>
            </div>

            {/* Mapa de selección de ubicación */}
            <div className="map-section">
              <h3 className="map-section-title">Ubicación en el mapa (Opcional)</h3>
              <p className="map-section-description">
                Selecciona la ubicación exacta de tu comercio en el mapa para que los clientes te encuentren más fácilmente.
              </p>
              
              <MapSelector 
                onLocationSelect={handleMapLocationSelect}
                initialPosition={getInitialMapPosition()}
              />
              
              <div className="coordinates-inputs">
                <div className="coordinate-input-group">
                  <label className="register-form-label">Latitud</label>
                  <input 
                    className={`register-form-input ${formErrors.latitud ? 'error' : ''}`}
                    name="latitud" 
                    type="number" 
                    step="any"
                    value={form.latitud}
                    readOnly 
                    onChange={handleChange} 
                  />
                  {formErrors.latitud && <span className="error-message">{formErrors.latitud}</span>}
                </div>
                
                <div className="coordinate-input-group">
                  <label className="register-form-label">Longitud</label>
                  <input 
                    className={`register-form-input ${formErrors.longitud ? 'error' : ''}`}
                    name="longitud" 
                    type="number" 
                    step="any"
                    value={form.longitud}
                    readOnly
                    onChange={handleChange} 
                  />
                  {formErrors.longitud && <span className="error-message">{formErrors.longitud}</span>}
                </div>
              </div>
              
              <button 
                type="button" 
                className="clear-coordinates-button"
                onClick={clearCoordinates}
              >
                🗑️ Limpiar coordenadas
              </button>
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
                  <li>✔ 20% de comision por pedido</li>
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
                  <p className="register-price">$30.000<span>/mes</span></p>
                </div>
                <ul className="register-features-list">
                  <li>✔ 10% de comision por pedido</li>
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
              <button 
                type="submit" 
                className="register-register-button"
                disabled={isLoading}
              >
                {isLoading ? "Registrando..." : "Registrar Comercio"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}