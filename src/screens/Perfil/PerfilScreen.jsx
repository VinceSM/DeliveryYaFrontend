// src/screens/Perfil/PerfilScreen.jsx
import { useState, useEffect } from "react";
import "../../styles/screens/PerfilScreen.css"
import Sidebar from "../../components/screens/Sidebar";
import { Store, Mail, Phone, Settings, CreditCard, Pin, MapPin, LifeBuoy } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { comerciosService } from "../../api/comercio";
import PerfilInformacion from "./PerfilInformacion";
import PerfilConfiguracion from "./PerfilConfiguracion";
import PerfilSoporte from "./PerfilSoporte";

export default function PerfilScreen() {
  const { user, loading: authLoading } = useAuth();
  const [seccionActiva, setSeccionActiva] = useState("informacion");
  const [loading, setLoading] = useState(true);
  const [comercio, setComercio] = useState(null);

  // Cargar datos del comercio cuando el usuario esté disponible
  useEffect(() => {
    if (user && !authLoading) {
      cargarDatosComercio();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const cargarDatosComercio = async () => {
    try {
      setLoading(true);
      
      console.log("👤 User desde AuthContext:", user);
      
      // ✅ BUSCAR EL COMERCIO ID - AHORA CON idComercio (C mayúscula)
      let comercioId = user?.idComercio; // ✅ CORREGIDO: usar idComercio
      
      if (comercioId) {
        console.log("✅ Comercio ID encontrado:", comercioId);
        
        // Cargar datos completos desde la API
        try {
          const comercioCompleto = await comerciosService.getById(comercioId);
          console.log("📊 Comercio completo desde API:", comercioCompleto);
          actualizarEstadoComercio(comercioCompleto);
        } catch (apiError) {
          console.error("❌ Error cargando desde API, usando datos locales:", apiError);
          // Si falla la API, usar los datos locales del user
          actualizarEstadoComercio(user);
        }
      } else {
        console.warn("⚠️ No se pudo obtener comercioId del user, usando datos locales");
        // Usar directamente los datos del user
        actualizarEstadoComercio(user);
      }
    } catch (error) {
      console.error("💥 Error cargando datos del comercio:", error);
      // Último recurso: usar datos del user
      actualizarEstadoComercio(user);
    } finally {
      setLoading(false);
    }
  };

  const actualizarEstadoComercio = (datos) => {
    if (!datos) {
      console.warn("⚠️ No hay datos para actualizar estado");
      setComercio(null);
      return;
    }
    
    console.log("📝 Actualizando estado del comercio con:", datos);
    
    const comercioActualizado = {
      // ✅ CORREGIDO: Usar idComercio (con C mayúscula)
      idcomercio: datos.idComercio || datos.idcomercio || datos.Id || datos.id,
      nombreComercio: datos.nombreComercio || datos.NombreComercio || "Mi Comercio",
      tipoComercio: datos.tipoComercio || datos.TipoComercio || "Restaurante",
      eslogan: datos.eslogan || datos.Eslogan || "",
      email: datos.email || datos.Email || "",
      celular: datos.celular || datos.Celular || "",
      ciudad: datos.ciudad || datos.Ciudad || "",
      calle: datos.calle || datos.Calle || "",
      numero: datos.numero || datos.Numero || "",
      encargado: datos.encargado || datos.Encargado || "",
      cvu: datos.cvu || datos.CVU || "",
      alias: datos.alias || datos.Alias || "",
      comision: datos.comision || datos.Comision || "",
      destacado: datos.destacado || datos.Destacado || false,
      deliveryPropio: datos.deliveryPropio || datos.DeliveryPropio || false,
      envio: datos.envio || datos.Envio || 0,
      sucursales: datos.sucursales || datos.Sucursales || 1,
      latitud: datos.latitud || datos.Latitud || 0,
      longitud: datos.longitud || datos.Longitud || 0
    };
    
    console.log("✅ Comercio actualizado:", comercioActualizado);
    setComercio(comercioActualizado);
  };

  const actualizarComercio = (nuevosDatos) => {
    console.log("🔄 Actualizando comercio con:", nuevosDatos);
    setComercio(prev => ({ ...prev, ...nuevosDatos }));
  };

  const obtenerDireccionCompleta = () => {
    if (!comercio) return "Sin dirección";
    return `${comercio.calle || ""} ${comercio.numero || ""}, ${comercio.ciudad || ""}`.trim();
  };

  // Función para cambiar sección
  const cambiarSeccion = (seccion) => {
    setSeccionActiva(seccion);
  };

  // Renderizar sección activa
  const renderSeccionActiva = () => {
    if (loading || authLoading) {
      return (
        <div className="loading-container">
          <div>Cargando información del comercio...</div>
        </div>
      );
    }

    if (!comercio) {
      return (
        <div className="error-container">
          <div>No se pudo cargar la información del comercio</div>
          <button onClick={cargarDatosComercio} className="btn-reintentar">
            Reintentar
          </button>
        </div>
      );
    }

    switch (seccionActiva) {
      case "informacion":
        return (
          <PerfilInformacion 
            comercio={comercio}
            onActualizarComercio={actualizarComercio}
            onRecargarDatos={cargarDatosComercio}
          />
        );
      case "configuracion":
        return <PerfilConfiguracion />;
      case "soporte":
        return <PerfilSoporte />;
      default:
        return (
          <PerfilInformacion 
            comercio={comercio}
            onActualizarComercio={actualizarComercio}
            onRecargarDatos={cargarDatosComercio}
          />
        );
    }
  };

  if (authLoading) {
    return (
      <div className="dashboard-container flex h-screen">
        <Sidebar />
        <main className="main-content flex-1 overflow-y-auto flex items-center justify-center">
          <div>Verificando autenticación...</div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dashboard-container flex h-screen">
        <Sidebar />
        <main className="main-content flex-1 overflow-y-auto flex items-center justify-center">
          <div>No hay usuario autenticado</div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-container flex h-screen">
      <Sidebar />
      
      <main className="main-content flex-1 overflow-y-auto">
        <div className="content-wrapper min-h-full p-8">
          {/* Header */}
          <div className="gestion-categorias-header">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="gestion-categorias-title">
                    Mi Perfil
                  </h1>
                  <p className="text-gray-600 text-lg mt-1 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Gestiona la información y configuracion de tu negocio
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="perfil-container">
            <div className="perfil-grid">
              {/* Panel lateral */}
              <div className="panel-lateral">
                <div className="avatar-perfil">
                  <div className="avatar-imagen">
                    <Store size={40} />
                  </div>
                  <h3 className="avatar-nombre">{comercio?.nombreComercio || "Mi Comercio"}</h3>
                  <p className="avatar-categoria">
                    {comercio?.eslogan || ""}
                  </p>
                  
                  <div className="info-adicional">
                    <div className="info-item">
                      <Mail size={14} />
                      <span>{comercio?.email || "No especificado"}</span>
                    </div>
                    <div className="info-item">
                      <Phone size={14} />
                      <span>{comercio?.celular || "No especificado"}</span>
                    </div>
                    <div className="info-item">
                      <MapPin size={14} />
                      <span className="direccion-texto">{obtenerDireccionCompleta()}</span>
                    </div>
                    {comercio?.destacado && (
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
                    onClick={() => cambiarSeccion('informacion')}
                  >
                    <Store size={18} />
                    Información
                  </button>
                  
                  <button 
                    className={`btn-menu ${seccionActiva === 'configuracion' ? 'active' : ''}`}
                    onClick={() => cambiarSeccion('configuracion')}
                  >
                    <Settings size={18} />
                    Configuración
                  </button>
                  
                  <button 
                    className={`btn-menu ${seccionActiva === 'soporte' ? 'active' : ''}`}
                    onClick={() => cambiarSeccion('soporte')}
                  >
                    <LifeBuoy size={18} />
                    Soporte
                  </button>
                </nav>
              </div>

              {/* Contenido principal */}
              <div className="contenido-perfil">
                {renderSeccionActiva()}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}