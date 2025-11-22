// src/screens/Auth/RegisterScreen.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { registerComercio } from "../../api/auth";
import LogoDeliveryYa from "../../assets/Logo.png";
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
    sucursales: 0,
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

  // Datos para las secciones de marketing
  const features = [
    {
      icon: "🚀",
      title: "Crecé tu negocio",
      description: "Llegá a más clientes y aumentá tus ventas con nuestra plataforma"
    },
    {
      icon: "📱",
      title: "App Móvil",
      description: "Tu comercio disponible 24/7 en la palma de la mano de tus clientes"
    },
    {
      icon: "💳",
      title: "Múltiples Pagos",
      description: "Aceptá transferencias, tarjetas y efectivo de forma segura"
    },
    {
      icon: "📊",
      title: "Panel de Control",
      description: "Gestioná pedidos, menú y estadísticas desde un solo lugar"
    }
  ];

  return (
    <div className="landing-register-container">
      {/* Header de Landing */}
      <header className="landing-header">
        <div className="landing-nav">
          <div className="landing-logo">
            <img src={LogoDeliveryYa} alt="Delivery Ya" />
            <span>Delivery Ya</span>
          </div>
          <nav className="landing-nav-links">
            <a href="#beneficios">Beneficios</a>
            <a href="#como-funciona">Cómo funciona</a>
            <a href="#contacto">Contacto</a>
          </nav>
          <div className="landing-auth-buttons">
            <Link to="/auth/login" className="btn-login">Ingresar</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Empezá a vender online 
              <span className="highlight"> hoy mismo</span>
            </h1>
            <p className="hero-description">
              Registrá tu comercio en Delivery Ya y empezá a recibir pedidos en menos de 5 minutos. 
              Sin costos iniciales, sin complicaciones.
            </p>
            <div className="hero-features">
              <div className="feature-badge">✅ Registro gratuito</div>
              <div className="feature-badge">✅ Configuración en 5 min</div>
              <div className="feature-badge">✅ Soporte 24/7</div>
            </div>
          </div>
        </div>
      </section>

      {/* Register Form Section - AHORA ES LO PRIMERO DESPUÉS DEL HERO */}
      <section className="register-form-section">
        <div className="container">
          <div className="register-header">
            <h1 className="register-title">Registrá tu comercio</h1>
            <p className="register-subtitle">Completá el formulario y empezá a vender online hoy mismo</p>
          </div>
          
          <form onSubmit={handleSubmit} className="register-form">
            <div className="register-sections-container">
              
              {/* SECCIÓN INFORMACIÓN BÁSICA */}
              <div className="register-section">
                <h2 className="register-section-title">Información Básica</h2>
                <div className="register-form-grid-three">
                  
                  {/* Fila 1 */}
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
                    <label className="register-form-label">Eslogan del Comercio (Opcional)</label>
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
                      <option value="">Tipo de comercio</option>
                      <option value="restaurante">Restaurante</option>
                      <option value="pizzeria">Pizzería</option>
                      <option value="hamburgueseria">Hamburguesería</option>
                      <option value="rotiseria">Rotisería</option>
                      <option value="sandwicheria">Sandwichería</option>
                      <option value="cafeteria">Cafetería</option>
                      <option value="pastas">Pastas</option>
                      <option value="sushi">Sushi</option>
                      <option value="heladeria">Heladería</option>
                      <option value="panaderia">Panadería</option>
                      <option value="supermercado">Supermercado</option>
                      <option value="kiosco">Kiosco</option>
                      <option value="verduleria">Verdulería</option>
                      <option value="carniceria">Carnicería</option>
                      <option value="polleria">Pollería</option>
                      <option value="pescaderia">Pescadería</option>
                      <option value="farmacia">Farmacia</option>
                      <option value="Otro">Otro</option>
                    </select>
                    {formErrors.tipoComercio && <span className="error-message">{formErrors.tipoComercio}</span>}
                  </div>

                  {/* Fila 2 */}
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
                      min={0}
                    />
                  </div>

                  <div className="register-input-group">
                    <label className="register-form-label">Encargado del Comercio *</label>
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

                </div>
              </div>

              {/* SECCIÓN CREDENCIALES */}
              <div className="register-section">
                <h2 className="register-section-title">Credenciales de Acceso al Panel</h2>
                <div className="register-form-grid-two">
                  
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
                <div className="register-form-grid-three">
                  
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
                <div className="map-header">
                  <h3 className="map-section-title">
                    📍 Ubicación en el mapa 
                    <span className="optional-badge">(Opcional)</span>
                  </h3>
                  <p className="map-section-description">
                    Haz clic en el mapa para seleccionar la ubicación exacta de tu comercio. 
                    Esto ayudará a los clientes a encontrarte más fácilmente.
                  </p>
                </div>
                
                <div className="map-container">
                  <MapSelector 
                    onLocationSelect={handleMapLocationSelect}
                    initialPosition={getInitialMapPosition()}
                  />
                </div>
                
                {/* Campos visibles para mejor control */}
                <div className="coordinates-fields">
                  <div className="coordinate-input-group">
                    <label className="coordinate-label">Latitud</label>
                    <input 
                      type="text"
                      className="coordinate-input"
                      name="latitud" 
                      value={form.latitud}
                      onChange={handleChange}
                      placeholder="Ej: -38.270510"
                      readOnly
                    />
                  </div>
                  <div className="coordinate-input-group">
                    <label className="coordinate-label">Longitud</label>
                    <input 
                      type="text"
                      className="coordinate-input"
                      name="longitud" 
                      value={form.longitud}
                      onChange={handleChange}
                      placeholder="Ej: -57.839651"
                      readOnly
                    />
                  </div>
                </div>
              </div>
              </div>

              {/* SECCIÓN DATOS BANCARIOS */}
              <div className="register-section">
                <h2 className="register-section-title">Datos Bancarios</h2>
                <div className="register-form-grid">
                  
                  <div className="register-input-group">
                    <label className="register-form-label">CVU (Opcional)</label>
                    <input 
                      className={`register-form-input-bancario ${formErrors.cvu ? 'error' : ''}`}
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
                      className={`register-form-input-bancario ${formErrors.alias ? 'error' : ''}`}
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

                  {/* PLAN BÁSICO */}
                  <div className="register-contract-option">
                    <div className="register-option-header">
                      <h3>Plan Básico</h3>
                      <p className="register-price">$30.000<span>/mes</span></p>
                    </div>
                    <ul className="register-features-list">
                      <li>✅ Hasta 50 pedidos mensuales</li>
                      <li>✅ 0% de comision por pedido</li>
                      <li>❌ Soporte prioritario</li>
                      <li>❌ Destacado en resultados</li>
                      <li>❌ Promociones destacadas</li>
                      <li>❌ Primera posición en resultados</li>
                    </ul>
                    <div className="register-radio-container">
                      <input 
                        type="radio" 
                        name="plan" 
                        checked={form.plan === "basico"} 
                        onChange={() => setForm(prev => ({ ...prev, plan: "basico" }))} 
                        id="plan-basico"
                      />
                      <label htmlFor="plan-basico" className="register-radio-label">
                        Seleccionar Plan Básico
                      </label>
                    </div>
                  </div>

                  {/* PLAN DESTACADO */}
                  <div className="register-contract-option register-highlighted">
                    <div className="register-option-header">
                      <h3>Plan Destacado</h3>
                      <p className="register-price">$60.000<span>/mes</span></p>
                    </div>
                    <ul className="register-features-list">
                      <li>✅ Hasta 100 pedidos mensuales</li>
                      <li>✅ Destacado en resultados</li>
                      <li>✅ 0% comision por pedido</li>
                      <li>✅ Soporte prioritario 24/7</li>
                      <li>❌ Promociones destacadas</li>
                      <li>❌ Primera posición en resultados</li>
                    </ul>
                    <div className="register-radio-container">
                      <input 
                        type="radio" 
                        name="plan" 
                        checked={form.plan === "destacado"} 
                        onChange={() => setForm(prev => ({ ...prev, plan: "destacado" }))} 
                        id="plan-destacado"
                      />
                      <label htmlFor="plan-destacado" className="register-radio-label">
                        Seleccionar Plan Destacado
                      </label>
                    </div>
                  </div>

                  {/* PLAN PREMIUM */}
                  <div className="register-contract-option register-premium">
                    <div className="register-option-header">
                      <h3>Plan Premium</h3>
                      <p className="register-price">$90.000<span>/mes</span></p>
                    </div>
                    <ul className="register-features-list">
                      <li>✅ Pedidos ilimitados</li>
                      <li>✅ 0% comision por pedido</li>
                      <li>✅ Primera posición en resultados</li>
                      <li>✅ Destacado Premium</li>
                      <li>✅ Comercio promocionable</li>
                      <li>✅ Soporte prioritario 24/7</li>
                    </ul>
                    <div className="register-radio-container">
                      <input 
                        type="radio" 
                        name="plan" 
                        checked={form.plan === "premium"} 
                        onChange={() => setForm(prev => ({ ...prev, plan: "premium" }))} 
                        id="plan-premium"
                      />
                      <label htmlFor="plan-premium" className="register-radio-label">
                        Seleccionar Plan Premium
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
                {isLoading ? "Registrando..." : "🚀 Empezar a vender ahora"}
              </button>
              
              <div className="register-login-link">
                ¿Ya tienes una cuenta? <Link to="/auth/login">Inicia sesión aquí</Link>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Features Section - DESPUÉS DEL FORMULARIO */}
      <section id="beneficios" className="features-section">
        <div className="container">
          <h2 className="section-title">Todo lo que obtenés con Delivery Ya</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download App Section */}
      <section className="download-section">
        <div className="container">
          <div className="download-content">
            <div className="download-text">
              <h2>Descargá nuestra app móvil</h2>
              <p>Tu comercio disponible para todos tus clientes. Llegá a más personas con nuestra aplicación.</p>
              <div className="download-buttons">
                <a href="#" className="store-btn">
                  <span>Disponible en</span>
                  <strong>Google Play</strong>
                </a>
                <a href="#" className="store-btn">
                  <span>Descargar en</span>
                  <strong>App Store</strong>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <img src={LogoDeliveryYa} alt="Delivery Ya" />
                <span>Delivery Ya</span>
              </div>
              <p>La plataforma de delivery líder en Miramar</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Comercios</h4>
                <a href="#beneficios">Beneficios</a>
                <a href="#como-funciona">Cómo funciona</a>
              </div>
              <div className="footer-column">
                <h4>Soporte</h4>
                <a href="#">Centro de ayuda</a>
                <a href="#">Contacto</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Delivery Ya. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}