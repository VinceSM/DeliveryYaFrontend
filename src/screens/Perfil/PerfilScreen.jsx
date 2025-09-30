import { useState } from "react";
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

export default function PerfilScreen() {
  const [seccionActiva, setSeccionActiva] = useState("informacion");
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  // Datos del comercio
  const [comercio, setComercio] = useState({
    nombre: "Mi Comercio Delicioso",
    descripcion: "Restaurante especializado en comida rápida y delivery",
    email: "contacto@micomercio.com",
    telefono: "+54 11 1234-5678",
    direccion: "Av. Principal 1234, Buenos Aires",
    horarioAtencion: "Lunes a Domingo: 9:00 - 23:00",
    categoria: "Restaurante",
    tiempoEntrega: "30-45 min",
    costoEnvio: 5.00
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
    // Simular guardado en API
    setTimeout(() => {
      setGuardando(false);
      setEditando(false);
      console.log("Datos guardados:", comercio);
    }, 1500);
  };

  const handleCancelar = () => {
    setEditando(false);
    // Aquí podrías resetear los datos desde la API
  };

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
            />
          </div>
        </div>

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
                  <h3 className="avatar-nombre">{comercio.nombre}</h3>
                  <p className="avatar-categoria">{comercio.categoria}</p>
                  
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