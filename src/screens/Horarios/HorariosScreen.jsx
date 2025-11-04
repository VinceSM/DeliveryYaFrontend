// src/screens/Horarios/HorariosScreen.jsx - VERSIÓN CORREGIDA
import { useState, useEffect } from "react";
import "../../styles/screens/HorariosScreen.css";
import Sidebar from "../../components/screens/Sidebar";
import { 
  Clock, 
  Save, 
  Plus, 
  Trash2, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  ChevronDown,
  ChevronUp 
} from "lucide-react";
import { useHorarios } from "../../hooks/useHorarios";

export default function HorariosScreen() {
  const { 
    horarios, 
    comercioAbierto, 
    diasSemana, 
    loading, 
    error, 
    recargarHorarios,
    formatearHora 
  } = useHorarios(1);

  const [horariosEditados, setHorariosEditados] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [diasExpandidos, setDiasExpandidos] = useState({});

  // Inicializar horarios
  useEffect(() => {
    if (horarios.length > 0) {
      const horariosIniciales = {};
      
      diasSemana.forEach(dia => {
        const horariosDia = horarios.filter(h => 
          h.dias && h.dias.includes(dia.id.toString())
        );
        
        horariosIniciales[dia.id] = horariosDia.length > 0 
          ? horariosDia.map(h => ({
              id: h.idhorarios,
              apertura: formatearHora(h.apertura),
              cierre: formatearHora(h.cierre),
              abierto: h.abierto ?? true
            }))
          : [{ id: null, apertura: '09:00', cierre: '18:00', abierto: true }];
      });
      
      setHorariosEditados(horariosIniciales);
    }
  }, [horarios]);

  const toggleDiaExpandido = (diaId) => {
    setDiasExpandidos(prev => ({
      ...prev,
      [diaId]: !prev[diaId]
    }));
  };

  // ✅ CORREGIDO: Usar diaId en lugar de dia.id
  const toggleDiaAbierto = (diaId) => {
    setHorariosEditados(prev => {
      const horariosDia = prev[diaId] || [];
      const nuevoEstado = !(horariosDia.length > 0 && horariosDia[0]?.abierto);
      
      return {
        ...prev,
        [diaId]: [{
          id: horariosDia[0]?.id || null,
          apertura: horariosDia[0]?.apertura || '09:00',
          cierre: horariosDia[0]?.cierre || '18:00',
          abierto: nuevoEstado
        }]
      };
    });
  };

  const actualizarHorarioDia = (diaId, nuevoHorario) => {
    setHorariosEditados(prev => ({
      ...prev,
      [diaId]: [nuevoHorario]
    }));
  };

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);
  };

  const guardarHorarios = async () => {
    setGuardando(true);
    
    try {
      // Validar horarios
      for (const diaId in horariosEditados) {
        const horariosDia = horariosEditados[diaId];
        if (horariosDia.length > 0 && horariosDia[0].abierto) {
          const { apertura, cierre } = horariosDia[0];
          if (apertura >= cierre) {
            const diaNombre = diasSemana.find(d => d.id === parseInt(diaId))?.nombre;
            throw new Error(`Horario inválido para ${diaNombre}: la hora de cierre debe ser posterior a la de apertura`);
          }
        }
      }

      // Aquí iría la llamada real a la API
      console.log('Guardando horarios:', horariosEditados);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      mostrarMensaje('exito', 'Horarios guardados correctamente');
      
    } catch (error) {
      mostrarMensaje('error', error.message);
    } finally {
      setGuardando(false);
    }
  };

  const copiarHorarios = (diaOrigenId) => {
    const horariosOrigen = horariosEditados[diaOrigenId];
    if (!horariosOrigen || horariosOrigen.length === 0) return;

    const nuevosHorarios = { ...horariosEditados };
    
    // Copiar a todos los días de la semana
    diasSemana.forEach(dia => {
      if (dia.id !== diaOrigenId) {
        nuevosHorarios[dia.id] = [...horariosOrigen];
      }
    });

    setHorariosEditados(nuevosHorarios);
    mostrarMensaje('exito', `Horarios copiados de ${diasSemana.find(d => d.id === diaOrigenId)?.nombre} a todos los días`);
  };

  if (loading && Object.keys(horariosEditados).length === 0) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <main className="main-content">
          <div className="loading-container">
            <RefreshCw className="animate-spin" size={32} />
            <p>Cargando horarios...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <main className="main-content">
        <div className="horarios-container">
          {/* Header */}
          <div className="horarios-header">
            <div className="header-info">
              <h1>Horarios de Atención</h1>
              <p>Configura los horarios en los que tu comercio está abierto</p>
            </div>
            
            <div className="header-actions">
              <div className={`estado-comercio ${comercioAbierto ? 'abierto' : 'cerrado'}`}>
                {comercioAbierto ? (
                  <>
                    <CheckCircle size={20} />
                    <span>Abierto ahora</span>
                  </>
                ) : (
                  <>
                    <XCircle size={20} />
                    <span>Cerrado ahora</span>
                  </>
                )}
              </div>
              
              <button 
                onClick={recargarHorarios}
                className="btn-recargar"
                disabled={loading}
              >
                <RefreshCw size={16} />
                Actualizar
              </button>
            </div>
          </div>

          {/* Mensajes */}
          {mensaje.texto && (
            <div className={`mensaje ${mensaje.tipo}`}>
              {mensaje.tipo === 'exito' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              <span>{mensaje.texto}</span>
            </div>
          )}

          {error && (
            <div className="mensaje error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Grid de días simplificado */}
          <div className="dias-grid-simple">
            {diasSemana.map(dia => {
              const horariosDia = horariosEditados[dia.id] || [];
              const diaAbierto = horariosDia.length > 0 && horariosDia[0]?.abierto;
              const expandido = diasExpandidos[dia.id];
              
              return (
                <div key={dia.id} className={`dia-card-simple ${!diaAbierto ? 'cerrado' : ''}`}>
                  <div className="dia-header-simple" onClick={() => toggleDiaExpandido(dia.id)}>
                    <div className="dia-info">
                      <h3>{dia.nombre}</h3>
                      <span className={`estado ${diaAbierto ? 'abierto' : 'cerrado'}`}>
                        {diaAbierto ? 'Abierto' : 'Cerrado'}
                      </span>
                    </div>
                    
                    <div className="dia-actions">
                      {diaAbierto && (
                        <span className="horario-display">
                          {horariosDia[0]?.apertura} - {horariosDia[0]?.cierre}
                        </span>
                      )}
                      {expandido ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>

                  {expandido && (
                    <div className="dia-content">
                      <div className="toggle-container">
                        <label className="toggle-label">
                          <span>Comercio abierto este día</span>
                          <input
                            type="checkbox"
                            checked={diaAbierto}
                            onChange={() => toggleDiaAbierto(dia.id)} 
                            className="toggle-input"
                          />
                        </label>
                      </div>

                      {diaAbierto && (
                        <div className="horario-config">
                          <div className="horario-inputs">
                            <div className="time-input-group">
                              <label>Apertura</label>
                              <input
                                type="time"
                                value={horariosDia[0]?.apertura || '09:00'}
                                onChange={(e) => actualizarHorarioDia(dia.id, {
                                  ...horariosDia[0],
                                  apertura: e.target.value
                                })}
                                className="time-input"
                              />
                            </div>
                            
                            <div className="time-input-group">
                              <label>Cierre</label>
                              <input
                                type="time"
                                value={horariosDia[0]?.cierre || '18:00'}
                                onChange={(e) => actualizarHorarioDia(dia.id, {
                                  ...horariosDia[0],
                                  cierre: e.target.value
                                })}
                                className="time-input"
                              />
                            </div>
                          </div>
                          
                          <button
                            onClick={() => copiarHorarios(dia.id)}
                            className="btn-copiar"
                          >
                            <Plus size={16} />
                            Copiar a otros días
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Acciones */}
          <div className="acciones-footer">
            <button className="btn-cancelar">
              Descartar cambios
            </button>
            <button 
              onClick={guardarHorarios}
              disabled={guardando}
              className="btn-guardar"
            >
              {guardando ? (
                <>
                  <RefreshCw className="animate-spin" size={16} />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Guardar horarios
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}