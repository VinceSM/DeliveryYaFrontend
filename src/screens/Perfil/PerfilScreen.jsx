import { useState, useEffect } from "react";
import "../../styles/screens/PerfilScreen.css";
import Sidebar from "../../components/screens/Sidebar";
import { 
  Settings, 
  Store, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  CreditCard, 
  Bell,
  Shield,
  Download,
  Upload,
  Save,
  Edit3
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { getComercioData } from "../../api/auth";
import { comerciosService } from "../../api/comercio"; // ✅ IMPORTACIÓN AGREGADA

export default function PerfilScreen() {
  const [seccionActiva, setSeccionActiva] = useState("informacion");
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const { user } = useAuth();

  // Datos del comercio - ahora con datos reales
  const [comercio, setComercio] = useState({
    nombre: "",
    descripcion: "Restaurante especializado en comida rápida y delivery",
    email: "",
    telefono: "",
    direccion: "",
    horarioAtencion: "Lunes a Domingo: 9:00 - 23:00",
    categoria: "Restaurante",
    tiempoEntrega: "30-45 min",
    costoEnvio: 5.00,
    encargado: "",
    cvu: "",
    alias: "",
    destacado: false
  });

  // Configuración
  const [configuracion, setConfiguracion] = useState({
    notificacionesPedidos: true,
    notificacionesStock: true,
    notificacionesPromociones: false,
    aceptaEfectivo: true,
    aceptaTarjeta: true,
    modoMantenimiento: false,
    pedidosAutomaticos: true
  });

  // ✅ Cargar datos reales cuando el componente se monta
  useEffect(() => {
    cargarDatosReales();
  }, []);

  const cargarDatosReales = () => {
    try {
      // Obtener datos del localStorage o del contexto
      const datosReales = getComercioData();
      
      if (datosReales) {
        console.log("📊 Datos reales del comercio:", datosReales);
        
        setComercio(prev => ({
          ...prev,
          nombre: datosReales.NombreComercio || "",
          email: datosReales.Email || "",
          telefono: datosReales.Celular || "",
          direccion: datosReales.Direccion || "",
          encargado: datosReales.Encargado || "",
          cvu: datosReales.CVU || "",
          alias: datosReales.Alias || "",
          destacado: datosReales.Destacado || false
        }));
      } else if (user) {
        console.log("📊 Usando datos del contexto:", user);
        
        setComercio(prev => ({
          ...prev,
          nombre: user.NombreComercio || "",
          email: user.Email || "",
          telefono: user.Celular || "",
          direccion: user.Direccion || "",
          encargado: user.Encargado || "",
          cvu: user.CVU || "",
          alias: user.Alias || "",
          destacado: user.Destacado || false
        }));
      }
    } catch (error) {
      console.error("💥 Error cargando datos reales:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setComercio(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleConfigChange = (name, value) => {
    setConfiguracion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGuardar = async () => {
    setGuardando(true);
    
    try {
      console.log("💾 Guardando datos:", comercio);
      
      // Obtener todos los datos del comercio
      const datosReales = getComercioData();
      console.log("📋 Datos reales completos:", datosReales);
      
      // Buscar el ID en diferentes propiedades posibles
      let comercioId = datosReales?.idcomercio || datosReales?.Id || datosReales?.id || datosReales?.ID;
      
      console.log("🔍 ID del comercio encontrado:", comercioId);

      if (!comercioId) {
        console.log("🔍 Buscando ID en todas las propiedades:", Object.keys(datosReales));
        
        // SOLUCIÓN: Obtener el ID desde la API buscando por email
        console.warn("⚠️ No se encontró ID, buscando en la API...");
        
        const todosComercios = await comerciosService.getAll();
        const comercioEncontrado = todosComercios.find(c => 
          c.email === comercio.email || c.Email === comercio.email
        );
        
        if (comercioEncontrado) {
          comercioId = comercioEncontrado.idcomercio || comercioEncontrado.Id || comercioEncontrado.id;
          console.log("✅ ID encontrado por email:", comercioId);
          
          // Guardar el ID en localStorage para futuras actualizaciones
          const datosActualizados = {
            ...datosReales,
            idcomercio: comercioId
          };
          localStorage.setItem('comercioData', JSON.stringify(datosActualizados));
        } else {
          throw new Error("No se pudo encontrar el comercio en la API");
        }
      }

      // Parsear la dirección para obtener calle, número y ciudad
      const direccionCompleta = comercio.direccion || "";
      let calle = "26";
      let numero = 472;
      let ciudad = "Miramar";

      if (direccionCompleta) {
        const partes = direccionCompleta.split(',');
        if (partes.length > 1) {
          ciudad = partes[1].trim();
        }
        
        const direccionPartes = partes[0].trim().split(' ');
        if (direccionPartes.length >= 2) {
          calle = direccionPartes[0];
          numero = parseInt(direccionPartes[1]) || 472;
        }
      }

      // Preparar datos para la API
      const datosParaAPI = {
        Id: comercioId,
        NombreComercio: comercio.nombre,
        Email: comercio.email,
        Celular: comercio.telefono,
        Ciudad: ciudad,
        Calle: calle,
        Numero: numero,
        Latitud: datosReales.Latitud || -34.6037,
        Longitud: datosReales.Longitud || -58.3816,
        Encargado: comercio.encargado,
        Cvu: comercio.cvu,
        Alias: comercio.alias,
        Destacado: comercio.destacado,
        FotoPortada: datosReales.FotoPortada || "",
        Password: ""
      };

      console.log("📤 Enviando datos a la API:", datosParaAPI);

      // ✅ Llamar a la API real para actualizar
      const resultado = await comerciosService.update(comercioId, datosParaAPI);
      
      console.log("✅ Datos guardados exitosamente:", resultado);
      
      // Actualizar localStorage con los nuevos datos
      const datosActualizados = {
        ...datosReales,
        idcomercio: comercioId,
        NombreComercio: comercio.nombre,
        Email: comercio.email,
        Celular: comercio.telefono,
        Encargado: comercio.encargado,
        CVU: comercio.cvu,
        Alias: comercio.alias,
        Destacado: comercio.destacado,
        Direccion: comercio.direccion
      };
      
      localStorage.setItem('comercioData', JSON.stringify(datosActualizados));
      
      alert("✅ Perfil actualizado correctamente");
      
    } catch (error) {
      console.error("❌ Error guardando datos:", error);
      alert("❌ Error al guardar los cambios: " + error.message);
    } finally {
      setGuardando(false);
      setEditando(false);
    }
  };

  const handleCancelar = () => {
    setEditando(false);
    // Recargar datos originales
    cargarDatosReales();
  };

  // ✅ Sección de información bancaria
  const renderInformacionBancaria = () => (
    <div className="form-seccion-bancaria">
      <h4 className="seccion-subtitulo">Información Bancaria</h4>
      <div className="form-grid">
        <div className="form-group-perfil">
          <label className="form-label-perfil">CVU</label>
          <input
            type="text"
            name="cvu"
            value={comercio.cvu}
            onChange={handleInputChange}
            className="form-input-perfil"
            disabled={!editando}
            placeholder="0000003100001234567890"
          />
        </div>

        <div className="form-group-perfil">
          <label className="form-label-perfil">Alias</label>
          <input
            type="text"
            name="alias"
            value={comercio.alias}
            onChange={handleInputChange}
            className="form-input-perfil"
            disabled={!editando}
            placeholder="mi.comercio.mp"
          />
        </div>

        <div className="form-group-perfil">
          <label className="form-label-perfil">Encargado</label>
          <input
            type="text"
            name="encargado"
            value={comercio.encargado}
            onChange={handleInputChange}
            className="form-input-perfil"
            disabled={!editando}
            placeholder="Nombre del encargado"
          />
        </div>

        <div className="form-group-perfil">
          <label className="form-label-perfil">Destacado</label>
          <div className="checkbox-container">
            <input
              type="checkbox"
              name="destacado"
              checked={comercio.destacado}
              onChange={(e) => setComercio(prev => ({ ...prev, destacado: e.target.checked }))}
              className="form-checkbox-perfil"
              disabled={!editando}
            />
            <span className="checkbox-label">Marcar como comercio destacado</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSeccionInformacion = () => (
    <div className="seccion-contenido">
      <div className="seccion-header">
        <h3 className="seccion-titulo">Información del Comercio</h3>
        {!editando && (
          <button 
            className="btn-editar"
            onClick={() => setEditando(true)}
          >
            <Edit3 size={16} />
            Editar Información
          </button>
        )}
      </div>

      <form className="form-perfil">
        <div className="form-grid">
          <div className="form-group-perfil">
            <label className="form-label-perfil">Nombre del Comercio</label>
            <input
              type="text"
              name="nombre"
              value={comercio.nombre}
              onChange={handleInputChange}
              className="form-input-perfil"
              disabled={!editando}
              placeholder="Ingresa el nombre de tu comercio"
            />
          </div>

          <div className="form-group-perfil">
            <label className="form-label-perfil">Categoría</label>
            <select
              name="categoria"
              value={comercio.categoria}
              onChange={handleInputChange}
              className="form-input-perfil"
              disabled={!editando}
            >
              <option value="Restaurante">Restaurante</option>
              <option value="Cafetería">Cafetería</option>
              <option value="Pizzería">Pizzería</option>
              <option value="Heladería">Heladería</option>
              <option value="Panadería">Panadería</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div className="form-group-perfil full-width">
            <label className="form-label-perfil">Descripción</label>
            <textarea
              name="descripcion"
              value={comercio.descripcion}
              onChange={handleInputChange}
              className="form-textarea-perfil"
              disabled={!editando}
              rows="3"
              placeholder="Describe tu comercio..."
            />
          </div>

          <div className="form-group-perfil">
            <label className="form-label-perfil">Email</label>
            <div className="input-with-icon">
              <Mail size={18} />
              <input
                type="email"
                name="email"
                value={comercio.email}
                onChange={handleInputChange}
                className="form-input-perfil"
                disabled={!editando}
                placeholder="correo@ejemplo.com"
              />
            </div>
          </div>

          <div className="form-group-perfil">
            <label className="form-label-perfil">Teléfono</label>
            <div className="input-with-icon">
              <Phone size={18} />
              <input
                type="tel"
                name="telefono"
                value={comercio.telefono}
                onChange={handleInputChange}
                className="form-input-perfil"
                disabled={!editando}
                placeholder="+54 11 1234-5678"
              />
            </div>
          </div>

          <div className="form-group-perfil full-width">
            <label className="form-label-perfil">Dirección</label>
            <div className="input-with-icon">
              <MapPin size={18} />
              <input
                type="text"
                name="direccion"
                value={comercio.direccion}
                onChange={handleInputChange}
                className="form-input-perfil"
                disabled={!editando}
                placeholder="Av. Principal 1234, Ciudad"
              />
            </div>
          </div>

          <div className="form-group-perfil">
            <label className="form-label-perfil">Horario de Atención</label>
            <div className="input-with-icon">
              <Clock size={18} />
              <input
                type="text"
                name="horarioAtencion"
                value={comercio.horarioAtencion}
                onChange={handleInputChange}
                className="form-input-perfil"
                disabled={!editando}
                placeholder="Lunes a Domingo: 9:00 - 23:00"
              />
            </div>
          </div>

          <div className="form-group-perfil">
            <label className="form-label-perfil">Tiempo de Entrega</label>
            <input
              type="text"
              name="tiempoEntrega"
              value={comercio.tiempoEntrega}
              onChange={handleInputChange}
              className="form-input-perfil"
              disabled={!editando}
              placeholder="30-45 min"
            />
          </div>

          <div className="form-group-perfil">
            <label className="form-label-perfil">Costo de Envío ($)</label>
            <input
              type="number"
              name="costoEnvio"
              value={comercio.costoEnvio}
              onChange={handleInputChange}
              className="form-input-perfil"
              disabled={!editando}
              step="0.01"
              min="0"
              placeholder="5.00"
            />
          </div>
        </div>

        {/* ✅ Nueva sección de información bancaria */}
        {renderInformacionBancaria()}

        {editando && (
          <div className="acciones-perfil">
            <button 
              type="button"
              className="btn-secundario"
              onClick={handleCancelar}
              disabled={guardando}
            >
              Cancelar
            </button>
            <button 
              type="button"
              className="btn-guardar-perfil"
              onClick={handleGuardar}
              disabled={guardando}
            >
              <Save size={16} />
              {guardando ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        )}
      </form>
    </div>
  );

  const renderSeccionConfiguracion = () => (
    <div className="seccion-contenido">
      <h3 className="seccion-titulo">Configuración</h3>
      
      <div className="config-grid">
        <div className="config-seccion">
          <h4 className="config-subtitulo">
            <Bell size={20} />
            Notificaciones
          </h4>
          
          <div className="config-lista">
            <div className="config-item-switch">
              <div className="config-info">
                <h5>Notificaciones de Pedidos</h5>
                <p>Recibir alertas por nuevos pedidos</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={configuracion.notificacionesPedidos}
                  onChange={(e) => handleConfigChange('notificacionesPedidos', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="config-item-switch">
              <div className="config-info">
                <h5>Alertas de Stock Bajo</h5>
                <p>Notificaciones cuando productos estén por agotarse</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={configuracion.notificacionesStock}
                  onChange={(e) => handleConfigChange('notificacionesStock', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="config-item-switch">
              <div className="config-info">
                <h5>Promociones y Novedades</h5>
                <p>Recibir información sobre nuevas promociones</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={configuracion.notificacionesPromociones}
                  onChange={(e) => handleConfigChange('notificacionesPromociones', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="config-seccion">
          <h4 className="config-subtitulo">
            <CreditCard size={20} />
            Métodos de Pago
          </h4>
          
          <div className="config-lista">
            <div className="config-item-switch">
              <div className="config-info">
                <h5>Aceptar Efectivo</h5>
                <p>Permitir pagos en efectivo al momento de la entrega</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={configuracion.aceptaEfectivo}
                  onChange={(e) => handleConfigChange('aceptaEfectivo', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="config-item-switch">
              <div className="config-info">
                <h5>Aceptar Tarjetas</h5>
                <p>Habilitar pagos con tarjeta de crédito/débito</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={configuracion.aceptaTarjeta}
                  onChange={(e) => handleConfigChange('aceptaTarjeta', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="config-seccion">
          <h4 className="config-subtitulo">
            <Shield size={20} />
            Sistema
          </h4>
          
          <div className="config-lista">
            <div className="config-item-switch">
              <div className="config-info">
                <h5>Modo Mantenimiento</h5>
                <p>Pausar temporalmente la recepción de pedidos</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={configuracion.modoMantenimiento}
                  onChange={(e) => handleConfigChange('modoMantenimiento', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="config-item-switch">
              <div className="config-info">
                <h5>Aceptar Pedidos Automáticamente</h5>
                <p>Los pedidos se aceptan automáticamente sin confirmación</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={configuracion.pedidosAutomaticos}
                  onChange={(e) => handleConfigChange('pedidosAutomaticos', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSeccionEstadisticas = () => (
    <div className="seccion-contenido">
      <h3 className="seccion-titulo">Estadísticas</h3>
      
      <div className="stats-perfil">
        <div className="stat-perfil">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(255, 77, 77, 0.1)' }}>
            <Store size={24} color="#FF4D4D" />
          </div>
          <div className="stat-numero">156</div>
          <div className="stat-descripcion">Pedidos este mes</div>
        </div>
        
        <div className="stat-perfil">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(255, 201, 71, 0.1)' }}>
            <CreditCard size={24} color="#FFC947" />
          </div>
          <div className="stat-numero">$3,458</div>
          <div className="stat-descripcion">Ingresos mensuales</div>
        </div>
        
        <div className="stat-perfil">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(40, 167, 69, 0.1)' }}>
            <Store size={24} color="#28a745" />
          </div>
          <div className="stat-numero">42</div>
          <div className="stat-descripcion">Productos activos</div>
        </div>
        
        <div className="stat-perfil">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(108, 117, 125, 0.1)' }}>
            <Clock size={24} color="#6c757d" />
          </div>
          <div className="stat-numero">4.7</div>
          <div className="stat-descripcion">Calificación promedio</div>
        </div>
      </div>

      <div className="acciones-exportar">
        <button className="btn-exportar">
          <Download size={16} />
          Exportar Reporte
        </button>
        <button className="btn-exportar">
          <Upload size={16} />
          Importar Datos
        </button>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container flex h-screen">
      <Sidebar />
      
      <main className="main-content flex-1 overflow-y-auto">
        <div className="content-wrapper min-h-full p-8">
          {/* Header */}
          <div className="content-header">
            <h1 className="content-title">Perfil del Comercio</h1>
            <p className="content-subtitle">Configura la información y preferencias de tu negocio</p>
          </div>

          <div className="perfil-container">
            <div className="perfil-grid">
              {/* Panel lateral */}
              <div className="panel-lateral">
                <div className="avatar-perfil">
                  <div className="avatar-imagen">
                    <Store size={40} />
                  </div>
                  <h3 className="avatar-nombre">{comercio.nombre || "Mi Comercio"}</h3>
                  <p className="avatar-categoria">{comercio.categoria}</p>
                  
                  <div className="info-adicional">
                    <div className="info-item">
                      <Mail size={14} />
                      <span>{comercio.email || "No especificado"}</span>
                    </div>
                    <div className="info-item">
                      <Phone size={14} />
                      <span>{comercio.telefono || "No especificado"}</span>
                    </div>
                    {comercio.destacado && (
                      <div className="badge-destacado">
                        ⭐ Comercio Destacado
                      </div>
                    )}
                  </div>
                  
                  <div className="avatar-acciones">
                    <button className="btn-avatar">Cambiar Logo</button>
                    <button className="btn-avatar">Ver Perfil Público</button>
                  </div>
                </div>

                <nav className="menu-perfil">
                  <button 
                    className={`btn-menu ${seccionActiva === 'informacion' ? 'active' : ''}`}
                    onClick={() => setSeccionActiva('informacion')}
                  >
                    <Store size={18} />
                    Información
                  </button>
                  
                  <button 
                    className={`btn-menu ${seccionActiva === 'configuracion' ? 'active' : ''}`}
                    onClick={() => setSeccionActiva('configuracion')}
                  >
                    <Settings size={18} />
                    Configuración
                  </button>
                  
                  <button 
                    className={`btn-menu ${seccionActiva === 'estadisticas' ? 'active' : ''}`}
                    onClick={() => setSeccionActiva('estadisticas')}
                  >
                    <CreditCard size={18} />
                    Estadísticas
                  </button>
                </nav>
              </div>

              {/* Contenido principal */}
              <div className="contenido-perfil">
                {seccionActiva === 'informacion' && renderSeccionInformacion()}
                {seccionActiva === 'configuracion' && renderSeccionConfiguracion()}
                {seccionActiva === 'estadisticas' && renderSeccionEstadisticas()}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}