// src/screens/Perfil/PerfilScreen.jsx
import { useState, useEffect } from "react";
import "../../styles/screens/PerfilScreen.css"
import Sidebar from "../../components/screens/Sidebar";
import { Store, Mail, Phone, Settings, CreditCard, Pin, MapPin } from "lucide-react";
import { getComercioData } from "../../api/auth";
import { comerciosService } from "../../api/comercio";
import PerfilInformacion from "./PerfilInformacion";
import PerfilConfiguracion from "./PerfilConfiguracion";
import PerfilEstadisticas from "./PerfilEstadisticas";

export default function PerfilScreen() {
  const [seccionActiva, setSeccionActiva] = useState("informacion");
  const [loading, setLoading] = useState(true);
  const [comercio, setComercio] = useState({
    idcomercio: null,
    nombreComercio: "",
    tipoComercio: "",
    eslogan: "",
    email: "",
    celular: "",
    ciudad: "",
    calle: "",
    numero: "",
    encargado: "",
    cvu: "",
    alias: "",
    comision: "",
    destacado: false,
    deliveryPropio: false,
    envio: 0,
    sucursales: 1,
    latitud: 0,
    longitud: 0
  });

  // Cargar datos del comercio
  useEffect(() => {
    cargarDatosComercio();
  }, []);

  const cargarDatosComercio = async () => {
    try {
      setLoading(true);
      const datosReales = getComercioData();
      
      if (datosReales) {
        console.log("📊 Datos reales del comercio:", datosReales);
        
        // Si no tenemos ID, buscar en la API
        if (!datosReales.idcomercio) {
          try {
            const todosComercios = await comerciosService.getAll();
            const comercioEncontrado = todosComercios.find(c => 
              c.email === datosReales.email || c.Email === datosReales.email
            );
            
            if (comercioEncontrado) {
              actualizarEstadoComercio(comercioEncontrado);
              setLoading(false);
              return;
            }
          } catch (apiError) {
            console.error("❌ Error obteniendo datos de API:", apiError);
          }
        }
        
        actualizarEstadoComercio(datosReales);
      }
    } catch (error) {
      console.error("💥 Error cargando datos del comercio:", error);
    } finally {
      setLoading(false);
    }
  };

  const actualizarEstadoComercio = (datos) => {
    setComercio({
      idcomercio: datos.idcomercio || datos.Id || datos.id || datos.ID,
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
    });
  };

  const actualizarComercio = (nuevosDatos) => {
    setComercio(prev => ({ ...prev, ...nuevosDatos }));
  };

  const obtenerDireccionCompleta = () => {
    return `${comercio.calle || ""} ${comercio.numero || ""}, ${comercio.ciudad || ""}`.trim();
  };

  // Función para cambiar sección que también verifica datos
  const cambiarSeccion = (seccion) => {
    setSeccionActiva(seccion);
    // Si los datos están vacíos, recargar
    if (!comercio.idcomercio && !loading) {
      cargarDatosComercio();
    }
  };

  // Renderizar sección activa
  const renderSeccionActiva = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div>Cargando información del comercio...</div>
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
      case "estadisticas":
        return <PerfilEstadisticas />;
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

  if (loading) {
    return (
      <div className="dashboard-container flex h-screen">
        <Sidebar />
        <main className="main-content flex-1 overflow-y-auto flex items-center justify-center">
          <div>Cargando perfil...</div>
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
                    Gestiona la información, configuracion y estadisticas de tu negocio
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
                  <h3 className="avatar-nombre">{comercio.nombreComercio}</h3>
                  <p className="avatar-categoria">
                    {comercio.eslogan}
                  </p>
                  
                  <div className="info-adicional">
                    <div className="info-item">
                      <Mail size={14} />
                      <span>{comercio.email || "No especificado"}</span>
                    </div>
                    <div className="info-item">
                      <Phone size={14} />
                      <span>{comercio.celular || "No especificado"}</span>
                    </div>
                    <div className="info-item">
                      <MapPin size={14} />
                      <span className="direccion-texto">{obtenerDireccionCompleta() || "Sin dirección"}</span>
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
                    className={`btn-menu ${seccionActiva === 'estadisticas' ? 'active' : ''}`}
                    onClick={() => cambiarSeccion('estadisticas')}
                  >
                    <CreditCard size={18} />
                    Estadísticas
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