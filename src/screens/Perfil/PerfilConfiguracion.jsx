// src/screens/Perfil/PerfilConfiguracion.jsx
import { useState } from "react";
import { 
  Bell,
  CreditCard,
  Shield,
  Save
} from "lucide-react";

export default function PerfilConfiguracion() {
  const [configuracion, setConfiguracion] = useState({
    notificacionesPedidos: true,
    notificacionesStock: true,
    notificacionesPromociones: false,
    aceptaEfectivo: true,
    aceptaTarjeta: true,
    modoMantenimiento: false,
    pedidosAutomaticos: true
  });

  const [guardando, setGuardando] = useState(false);

  const handleConfigChange = (name, value) => {
    setConfiguracion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGuardarConfiguracion = async () => {
    setGuardando(true);
    try {
      // Simular guardado en API
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("💾 Guardando configuración:", configuracion);
      alert("✅ Configuración guardada correctamente");
    } catch (error) {
      console.error("❌ Error guardando configuración:", error);
      alert("❌ Error al guardar la configuración");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="seccion-contenido">
      <div className="seccion-header">
        <h3 className="seccion-titulo">Configuración del Sistema</h3>
        <button 
          className="btn-guardar-perfil"
          onClick={handleGuardarConfiguracion}
          disabled={guardando}
        >
          <Save size={16} />
          {guardando ? "Guardando..." : "Guardar Configuración"}
        </button>
      </div>
      
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
                <h5>Aceptar Tarjetas y Billeteras Virtuales</h5>
                <p>Habilitar pagos con tarjeta de crédito/débito y billeteras virtuales</p>
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
      </div>
    </div>
  );
}