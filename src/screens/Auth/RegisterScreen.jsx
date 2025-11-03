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
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [fileName, setFileName] = useState("");
  
  // Estado con valores por defecto - AGREGAR ENVIO
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
    eslogan: "",
    sucursales: 1,
    envio: 0 // ← CAMPO NUEVO AGREGADO
  });

  const handleMapLocationSelect = (lat, lng) => {
    setForm(prev => ({
      ...prev,
      latitud: lat.toString(),
      longitud: lng.toString()
    }));
  };

  // Manejar la selección de archivos
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
      setFileName(file.name);
      
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
    setFileName("");
    setForm(prev => ({ ...prev, fotoPortada: "" }));
    
    // Resetear el input file
    const fileInput = document.getElementById('fotoPortadaUpload');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "sucursales") {
      // Manejo especial para sucursales - permite 0 pero no null/vacío
      const numericValue = value.replace(/\D/g, ''); // Remover caracteres no numéricos
      
      if (numericValue === '') {
        // Si está vacío, establecer 0
        setForm(prev => ({
          ...prev,
          [name]: 0
        }));
      } else {
        // Convertir a número y permitir 0
        const finalValue = parseInt(numericValue) || 0;
        setForm(prev => ({
          ...prev,
          [name]: finalValue
        }));
      }
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Validaciones básicas
    if (!form.nombreComercio?.trim()) errors.nombreComercio = "El nombre del comercio es requerido";
    if (!form.email?.trim()) errors.email = "El email es requerido";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = "El email no es válido";
    if (!form.password) errors.password = "La contraseña es requerida";
    else if (form.password.length < 6) errors.password = "La contraseña debe tener al menos 6 caracteres";
    if (!form.encargado?.trim()) errors.encargado = "El encargado es requerido";
    if (!form.celular?.trim()) errors.celular = "El celular es requerido";
    if (!form.tipoComercio?.trim()) errors.tipoComercio = "El tipo de comercio es requerido";
    if (!form.eslogan?.trim()) errors.eslogan = "El eslogan es requerido";
    // CVU ya no es obligatorio - se elimina la validación
    if (!form.alias?.trim()) errors.alias = "El alias es requerido";
    if (!form.ciudad?.trim()) errors.ciudad = "La ciudad es requerida";
    if (!form.calle?.trim()) errors.calle = "La calle es requerida";
    if (!form.numero?.trim()) errors.numero = "El número es requerido";
    else if (isNaN(form.numero)) errors.numero = "El número debe ser un valor numérico";
    
    // Sucursales: no necesita validación ya que siempre tendrá un valor numérico (0 o mayor)
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert("❌ Por favor corrige los errores en el formulario");
      return;
    }

    setIsLoading(true);
    
    try {
      const comercioData = {
        NombreComercio: String(form.nombreComercio || ""),
        Email: String(form.email || ""),
        Password: String(form.password || ""),
        FotoPortada: String(form.fotoPortada || ""),
        TipoComercio: String(form.tipoComercio || ""), // ← CAMBIAR a "TipoComercio" (con T mayúscula)
        Celular: String(form.celular || ""),
        Ciudad: String(form.ciudad || ""),
        Calle: String(form.calle || ""),
        Numero: Number(form.numero) || 0,
        Latitud: form.latitud ? Number(form.latitud) : 0,
        Longitud: form.longitud ? Number(form.longitud) : 0,
        Encargado: String(form.encargado || ""),
        Cvu: String(form.cvu || ""), // ← Enviar siempre aunque sea string vacío
        Alias: String(form.alias || ""),
        Destacado: Boolean(form.destacado),
        DeliveryPropio: Boolean(form.deliveryPropio),
        Eslogan: String(form.eslogan || ""), // ← Asegurar que se envía
        Sucursales: Number(form.sucursales) || 0, // Permite 0
        Envio: Number(form.envio) || 0 // ← CAMPO NUEVO AGREGADO
      };

      console.log('📤 Datos procesados para enviar:', comercioData);
      
      const response = await registerComercio(comercioData);
      console.log('✅ Registro exitoso:', response);
      
      alert("✅ Comercio registrado exitosamente");
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("❌ Error en registro:", error);
      
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

  return (
    <div className="register-container">
      <div className="register-header">
        <img src={LogoDeliveryYa} alt="Logo DeliveryYa" className="register-logo" />
        
        <div className="register-back-link">
          <Link to="/auth/login">
            ← Volver al Login
          </Link>
        </div>
        
        <h1 className="register-title">Registro de Comercio</h1>
        <p className="register-subtitle">Completa todos los datos de tu comercio en un solo paso</p>
      </div>
      
      <form onSubmit={handleSubmit} className="register-form">
        <div className="register-sections-container">
          
          {/* SECCIÓN INFORMACIÓN BÁSICA */}
          <div className="register-section">
            <h2 className="register-section-title">Información Básica</h2>
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
                <label className="register-form-label">Eslogan *</label>
                <input 
                  className={`register-form-input ${formErrors.eslogan ? 'error' : ''}`}
                  name="eslogan" 
                  value={form.eslogan}
                  placeholder="Tu eslogan comercial" 
                  onChange={handleChange} 
                />
                {formErrors.eslogan && <span className="error-message">{formErrors.eslogan}</span>}
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
                  <option value="Almacén">Almacén</option>
                  <option value="Kiosco">Kiosco</option>
                  <option value="Farmacia">Farmacia</option>
                  <option value="Verdulería">Verdulería</option>
                  <option value="Carnicería">Carnicería</option>
                  <option value="Panadería">Panadería</option>
                  <option value="Otro">Otro</option>
                </select>
                {formErrors.tipoComercio && <span className="error-message">{formErrors.tipoComercio}</span>}
              </div>

              <div className="register-input-group">
                <label className="register-form-label">
                  Número de Sucursales
                  <div className="info-tooltip">
                    <span className="info-icon">ℹ️</span>
                    <div className="tooltip-text">
                      Podrás registrar tu primera sucursal en este proceso. Al finalizar, un asesor se pondrá en contacto contigo para gestionar el alta de las sucursales restantes.
                    </div>
                  </div>
                </label>
                <input 
                  className="register-form-input no-spinner"
                  name="sucursales" 
                  value={form.sucursales}
                  onChange={handleChange}
                  pattern="[0-9]*"
                  inputMode="numeric"
                />
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
                <label className="register-form-label">Celular *</label>
                <input 
                  className={`register-form-input ${formErrors.celular ? 'error' : ''}`}
                  name="celular" 
                  value={form.celular}
                  placeholder="+54 9 11 1234-5678" 
                  onChange={handleChange} 
                />
                {formErrors.celular && <span className="error-message">{formErrors.celular}</span>}
              </div>

            </div>
          </div>

          {/* SECCIÓN CREDENCIALES */}
          <div className="register-section">
            <h2 className="register-section-title">Credenciales de Acceso</h2>
            <div className="register-form-grid">
              
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

            </div>
          </div>

          {/* SECCIÓN UBICACIÓN */}
          <div className="register-section">
            <h2 className="register-section-title">Ubicación</h2>
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
              
              {/* Campos ocultos para latitud y longitud */}
              <input 
                type="hidden"
                name="latitud" 
                value={form.latitud}
                onChange={handleChange} 
              />
              <input 
                type="hidden"
                name="longitud" 
                value={form.longitud}
                onChange={handleChange} 
              />
            </div>
          </div>

          {/* SECCIÓN DATOS BANCARIOS */}
          <div className="register-section">
            <h2 className="register-section-title">Datos Bancarios</h2>
            <div className="register-form-grid">
              
              <div className="register-input-group">
                <label className="register-form-label">CVU (Opcional)</label>
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

            </div>
          </div>

          {/* SECCIÓN CONFIGURACIÓN */}
          <div className="register-section">
            <h2 className="register-section-title">Configuración</h2>
            <div className="register-form-grid">
              
              <div className="register-input-group">
                <label className="register-form-label">Sistema de Delivery</label>
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
                        <span>Seleccionar imagen</span>
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
          </div>

          {/* SECCIÓN PLAN */}
          <div className="register-section">
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
          </div>

        </div>
        
        {/* BOTÓN DE REGISTRO */}
        <div className="register-submit-section">
          <button 
            type="submit" 
            className="register-register-button"
            disabled={isLoading}
          >
            {isLoading ? "Registrando..." : "Registrar Comercio"}
          </button>
          
          <div className="register-login-link">
            ¿Ya tienes una cuenta? <Link to="/auth/login">Inicia sesión aquí</Link>
          </div>
        </div>
      </form>
    </div>
  );
}