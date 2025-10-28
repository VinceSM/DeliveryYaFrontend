// src/screens/Horarios/HorariosScreen.jsx - VERSIÓN CORREGIDA
import { useState, useEffect } from "react";
import "../../styles/screens/HorariosScreen.css";
import Sidebar from "../../components/screens/Sidebar";
import { Clock, Save, Plus, Trash2, RefreshCw, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useHorarios } from "../../hooks/useHorarios";

export default function HorariosScreen() {
  const { 
    horariosComercio, 
    comercioAbierto, 
    diasSemana, 
    loading, 
    error, 
    recargarHorariosComercio,
    formatearHora
  } = useHorarios(1); // ID fijo por ahora

  const [horariosEditados, setHorariosEditados] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');

  // ✅ CORREGIDO: Inicializar horarios una sola vez
  useEffect(() => {
    if (horariosComercio.length > 0) {
      const horariosIniciales = {};
      
      diasSemana.forEach(dia => {
        const horariosDia = horariosComercio.filter(h => 
          h.dias && h.dias.includes(dia.id)
        );
        
        horariosIniciales[dia.id] = horariosDia.length > 0 
          ? horariosDia.map(h => ({
              id: h.idhorarios,
              apertura: formatearHora(h.apertura) || '09:00',
              cierre: formatearHora(h.cierre) || '18:00',
              abierto: h.abierto ?? true
            }))
          : [{ id: `nuevo-${dia.id}`, apertura: '09:00', cierre: '18:00', abierto: true }];
      });
      
      setHorariosEditados(horariosIniciales);
    }
  }, [horariosComercio]); // ✅ Solo depende de horariosComercio

  const handleCambioHorario = (dia, index, campo, valor) => {
    setHorariosEditados(prev => ({
      ...prev,
      [dia]: prev[dia].map((horario, i) => 
        i === index ? { ...horario, [campo]: valor } : horario
      )
    }));
  };

  const agregarHorarioDia = (dia) => {
    setHorariosEditados(prev => ({
      ...prev,
      [dia]: [...(prev[dia] || []), { 
        id: `nuevo-${dia}-${Date.now()}`, 
        apertura: '09:00', 
        cierre: '18:00', 
        abierto: true 
      }]
    }));
  };

  const eliminarHorario = (dia, index) => {
    const horario = horariosEditados[dia][index];
    
    // Si es un horario existente (no nuevo), confirmar eliminación
    if (horario.id && !horario.id.startsWith('nuevo-')) {
      if (!window.confirm('¿Estás seguro de que quieres eliminar este horario?')) {
        return;
      }
    }
    
    // Eliminar del estado local
    setHorariosEditados(prev => ({
      ...prev,
      [dia]: prev[dia].filter((_, i) => i !== index)
    }));
  };

  const toggleDiaAbierto = (dia) => {
    const horariosDia = horariosEditados[dia] || [];
    const tieneHorarios = horariosDia.length > 0;
    
    if (tieneHorarios) {
      const nuevoEstado = !horariosDia[0].abierto;
      
      setHorariosEditados(prev => ({
        ...prev,
        [dia]: prev[dia].map(horario => ({
          ...horario,
          abierto: nuevoEstado
        }))
      }));
    }
  };

  const guardarHorarios = async () => {
    setGuardando(true);
    setMensajeExito('');
    
    try {
      // Simular guardado (por ahora)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMensajeExito('Horarios guardados exitosamente');
      setTimeout(() => setMensajeExito(''), 3000);
      
      console.log('📤 Horarios a guardar:', horariosEditados);
      
    } catch (error) {
      console.error('❌ Error guardando horarios:', error);
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container flex h-screen">
        <Sidebar />
        <main className="main-content flex-1 overflow-y-auto">
          <div className="content-wrapper min-h-full p-8 flex items-center justify-center">
            <div className="text-center">
              <RefreshCw size={48} className="animate-spin mx-auto mb-4 text-blue-500" />
              <p className="text-gray-600">Cargando horarios...</p>
            </div>
          </div>
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
          <div className="content-header">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="content-title">Configuración de Horarios</h1>
                <p className="content-subtitle">Gestiona los horarios de atención de tu comercio</p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Estado del comercio */}
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  comercioAbierto 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {comercioAbierto ? (
                    <>
                      <CheckCircle size={20} />
                      <span className="font-semibold">Abierto</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={20} />
                      <span className="font-semibold">Cerrado</span>
                    </>
                  )}
                </div>
                
                <button 
                  onClick={recargarHorariosComercio}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
                >
                  <RefreshCw size={16} />
                  Actualizar
                </button>
              </div>
            </div>
          </div>

          {/* Mostrar error si existe */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="text-red-600" />
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Mensaje de éxito */}
          {mensajeExito && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-600" />
                <p className="text-green-800">{mensajeExito}</p>
              </div>
            </div>
          )}

          {/* Grid de días */}
          <div className="dias-grid">
            {diasSemana.map(dia => {
              const horariosDia = horariosEditados[dia.id] || [];
              const diaAbierto = horariosDia.length > 0 && horariosDia[0]?.abierto;
              
              return (
                <div key={dia.id} className={`dia-card ${!diaAbierto ? 'dia-cerrado' : ''}`}>
                  <div className="dia-header">
                    <h3 className="dia-nombre">{dia.nombre}</h3>
                    
                    <div className="estado-dia">
                      <span className="text-sm text-gray-600">
                        {diaAbierto ? 'Abierto' : 'Cerrado'}
                      </span>
                      <label className="switch">
                        <input 
                          type="checkbox" 
                          checked={diaAbierto}
                          onChange={() => toggleDiaAbierto(dia.id)}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>

                  {!diaAbierto ? (
                    <div className="mensaje-cerrado">
                      <p>El comercio está cerrado este día</p>
                    </div>
                  ) : (
                    <div className="horarios-list">
                      {horariosDia.map((horario, index) => (
                        <div key={horario.id || index} className="horario-item">
                          <div className="hora-input">
                            <input
                              type="time"
                              value={horario.apertura}
                              onChange={(e) => handleCambioHorario(dia.id, index, 'apertura', e.target.value)}
                              className="input-time"
                            />
                            <span className="separador">-</span>
                            <input
                              type="time"
                              value={horario.cierre}
                              onChange={(e) => handleCambioHorario(dia.id, index, 'cierre', e.target.value)}
                              className="input-time"
                            />
                          </div>
                          
                          <button
                            onClick={() => eliminarHorario(dia.id, index)}
                            className="btn-eliminar-horario"
                            title="Eliminar horario"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                      
                      <button
                        onClick={() => agregarHorarioDia(dia.id)}
                        className="btn-agregar-horario"
                      >
                        <Plus size={16} />
                        Agregar otro horario
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Configuración avanzada */}
          <div className="configuracion-avanzada">
            <h3 className="config-title">Configuración Avanzada</h3>
            <div className="config-options">
              <div className="config-option">
                <input type="checkbox" id="horario-continuo" />
                <label htmlFor="horario-continuo">Horario continuo</label>
              </div>
              <div className="config-option">
                <input type="checkbox" id="mostrar-horario" defaultChecked />
                <label htmlFor="mostrar-horario">Mostrar horario en público</label>
              </div>
              <div className="config-option">
                <input type="checkbox" id="permitir-pedidos" defaultChecked />
                <label htmlFor="permitir-pedidos">Permitir pedidos fuera de horario</label>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="acciones-horarios">
            <button className="btn-cancelar">
              Cancelar
            </button>
            <button 
              onClick={guardarHorarios}
              disabled={guardando}
              className="btn-guardar"
            >
              {guardando ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Guardar Horarios
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}