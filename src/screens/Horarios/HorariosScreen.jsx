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
    //formatearHora,
    guardarHorarios,
    getEstructuraHorariosUI,
    hayCambiosSinGuardar
  } = useHorarios(1);

  const [horariosEditados, setHorariosEditados] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [diasExpandidos, setDiasExpandidos] = useState({});

  // Inicializar horarios editados - CORREGIDO
  useEffect(() => {
  if (!loading && horarios.length >= 0) { // Cambiado a >= 0 para incluir array vacío
    const estructuraUI = getEstructuraHorariosUI();
    console.log('🎨 Estructura UI cargada (una vez):', estructuraUI);
    setHorariosEditados(estructuraUI);
    
    // Expandir automáticamente los días que tienen horarios
    const nuevosExpandidos = {};
    diasSemana.forEach(dia => {
      const horariosDia = estructuraUI[dia.id] || [];
      if (horariosDia.some(h => h.abierto)) {
        nuevosExpandidos[dia.id] = true;
      }
    });
    setDiasExpandidos(nuevosExpandidos);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [loading, horarios.length]);

  const toggleDiaExpandido = (diaId) => {
    setDiasExpandidos(prev => ({
      ...prev,
      [diaId]: !prev[diaId]
    }));
  };

  const toggleDiaAbierto = (diaId) => {
    setHorariosEditados(prev => {
      const horariosDia = prev[diaId] || [];
      const diaActualmenteAbierto = horariosDia.some(h => h.abierto);
      const nuevoEstado = !diaActualmenteAbierto;
      
      if (nuevoEstado && horariosDia.length === 0) {
        // Si se abre el día y no hay horarios, agregar uno por defecto
        return {
          ...prev,
          [diaId]: [{
            id: null,
            apertura: '09:00',
            cierre: '18:00',
            abierto: true
          }]
        };
      } else if (nuevoEstado && !diaActualmenteAbierto) {
        // Si hay horarios pero están cerrados, activarlos todos
        return {
          ...prev,
          [diaId]: horariosDia.map(horario => ({
            ...horario,
            abierto: true
          }))
        };
      } else {
        // Si se cierra el día, desactivar todos los horarios
        return {
          ...prev,
          [diaId]: horariosDia.map(horario => ({
            ...horario,
            abierto: false
          }))
        };
      }
    });
  };

  const agregarHorario = (diaId) => {
    setHorariosEditados(prev => {
      const horariosDia = prev[diaId] || [];
      
      // Encontrar el último horario para usar como base
      const ultimoHorario = horariosDia.length > 0 
        ? horariosDia[horariosDia.length - 1] 
        : { apertura: '09:00', cierre: '18:00' };
      
      // Calcular nuevo horario (1 hora después del último cierre)
      const [ultimasHoras, ultimosMinutos] = ultimoHorario.cierre.split(':').map(Number);
      let nuevasHoras = ultimasHoras + 1;
      if (nuevasHoras >= 24) nuevasHoras = 23;
      
      const nuevoCierre = `${nuevasHoras.toString().padStart(2, '0')}:${ultimosMinutos.toString().padStart(2, '0')}`;
      
      return {
        ...prev,
        [diaId]: [
          ...horariosDia,
          { 
            id: null, 
            apertura: ultimoHorario.cierre, // Comienza donde termina el anterior
            cierre: nuevoCierre, 
            abierto: true 
          }
        ]
      };
    });
  };

  const eliminarHorario = (diaId, index) => {
    setHorariosEditados(prev => {
      const nuevosHorarios = [...(prev[diaId] || [])];
      nuevosHorarios.splice(index, 1);
      
      // Si no quedan horarios, agregar uno vacío pero cerrado
      if (nuevosHorarios.length === 0) {
        nuevosHorarios.push({ 
          id: null, 
          apertura: '09:00', 
          cierre: '18:00', 
          abierto: false 
        });
      }
      
      return {
        ...prev,
        [diaId]: nuevosHorarios
      };
    });
  };

  const actualizarHorario = (diaId, index, campo, valor) => {
    setHorariosEditados(prev => {
      const nuevosHorarios = [...(prev[diaId] || [])];
      nuevosHorarios[index] = {
        ...nuevosHorarios[index],
        [campo]: valor
      };
      
      return {
        ...prev,
        [diaId]: nuevosHorarios
      };
    });
  };

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje({ tipo: '', texto: '' }), 5000);
  };

  const handleGuardarHorarios = async () => {
    setGuardando(true);
    
    try {
      console.log('💾 Iniciando guardado de horarios...', horariosEditados);

      // Validación básica
      const errores = [];
      for (const [diaId, horariosDia] of Object.entries(horariosEditados)) {
        const diaNombre = diasSemana.find(d => d.id === parseInt(diaId))?.nombre;
        const horariosActivos = horariosDia.filter(h => h.abierto);
        
        for (const horario of horariosActivos) {
          if (horario.apertura >= horario.cierre) {
            errores.push(`${diaNombre}: Cierre (${horario.cierre}) debe ser posterior a apertura (${horario.apertura})`);
          }
          
          // Validar formato de hora
          if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(horario.apertura) || 
              !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(horario.cierre)) {
            errores.push(`${diaNombre}: Formato de hora inválido`);
          }
        }
      }
      
      if (errores.length > 0) {
        throw new Error(errores.join(', '));
      }

      const resultado = await guardarHorarios(horariosEditados);
      mostrarMensaje('exito', resultado.message || 'Horarios guardados correctamente');
      
    } catch (error) {
      console.error('❌ Error guardando horarios:', error);
      mostrarMensaje('error', error.message);
    } finally {
      setGuardando(false);
    }
  };

  const copiarHorarios = (diaOrigenId) => {
    const horariosOrigen = horariosEditados[diaOrigenId];
    if (!horariosOrigen || horariosOrigen.length === 0) return;

    const nuevosHorarios = { ...horariosEditados };
    const diaOrigenNombre = diasSemana.find(d => d.id === diaOrigenId)?.nombre;
    
    // Copiar a todos los días excepto al origen
    diasSemana.forEach(dia => {
      if (dia.id !== diaOrigenId) {
        nuevosHorarios[dia.id] = horariosOrigen.map(horario => ({ 
          ...horario,
          id: null // Resetear ID para evitar conflictos
        }));
      }
    });

    setHorariosEditados(nuevosHorarios);
    mostrarMensaje('info', `Horarios de ${diaOrigenNombre} copiados a todos los días`);
  };

  const resetearCambios = () => {
    const estructuraOriginal = getEstructuraHorariosUI();
    setHorariosEditados(estructuraOriginal);
    mostrarMensaje('info', 'Cambios descartados');
  };

  const expandirTodos = () => {
    const todosExpandidos = {};
    diasSemana.forEach(dia => {
      todosExpandidos[dia.id] = true;
    });
    setDiasExpandidos(todosExpandidos);
  };

  const colapsarTodos = () => {
    setDiasExpandidos({});
  };

  // Verificar si hay cambios sin guardar
  const hayCambios = hayCambiosSinGuardar && hayCambiosSinGuardar(horariosEditados);

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
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="horarios-title">
                    Horarios de Atención
                  </h1>
                  <p className="text-gray-600 text-lg mt-1 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Configura los horarios en los que tu comercio está abierto
                  </p>
                </div>
              </div>
            </div>
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

              {hayCambios && (
                    <div className="cambios-pendientes">
                      <AlertCircle size={16} />
                      <span>Tienes cambios sin guardar</span>
                    </div>
                  )}
              
              <div className="header-buttons">
                <button 
                  onClick={expandirTodos}
                  className="btn-expandir"
                >
                  Expandir todos
                </button>
                <button 
                  onClick={colapsarTodos}
                  className="btn-colapsar"
                >
                  Colapsar todos
                </button>
              </div>
            </div>

          {/* Mensajes */}
          {mensaje.texto && (
            <div className={`mensaje ${mensaje.tipo}`}>
              {mensaje.tipo === 'exito' ? <CheckCircle size={16} /> : 
               mensaje.tipo === 'error' ? <AlertCircle size={16} /> : 
               mensaje.tipo === 'info' ? <AlertCircle size={16} /> : <AlertCircle size={16} />}
              <span>{mensaje.texto}</span>
            </div>
          )}

          {error && (
            <div className="mensaje error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Grid de días con múltiples horarios */}
          <div className="dias-grid">
            {diasSemana.map(dia => {
              const horariosDia = horariosEditados[dia.id] || [];
              const diaAbierto = horariosDia.some(h => h.abierto);
              const expandido = diasExpandidos[dia.id];
              const cantidadHorariosActivos = horariosDia.filter(h => h.abierto).length;
              
              return (
                <div key={dia.id} className={`dia-card ${!diaAbierto ? 'cerrado' : ''}`}>
                  <div className="dia-header" onClick={() => toggleDiaExpandido(dia.id)}>
                    <div className="dia-info">
                      <h3>{dia.nombre}</h3>
                      <span className={`estado ${diaAbierto ? 'abierto' : 'cerrado'}`}>
                        {diaAbierto ? 'Abierto' : 'Cerrado'}
                        {diaAbierto && cantidadHorariosActivos > 0 && ` (${cantidadHorariosActivos} horario${cantidadHorariosActivos > 1 ? 's' : ''})`}
                      </span>
                    </div>
                    
                    <div className="dia-actions">
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
                        <div className="horarios-multiples">
                          <div className="horarios-list">
                            {horariosDia.map((horario, index) => (
                              <div key={index} className="horario-item">
                                <div className="horario-inputs">
                                  <div className="time-input-group">
                                    <label>Apertura</label>
                                    <input
                                      type="time"
                                      value={horario.apertura}
                                      onChange={(e) => actualizarHorario(dia.id, index, 'apertura', e.target.value)}
                                      className="time-input"
                                      disabled={!horario.abierto}
                                    />
                                  </div>
                                  
                                  <div className="time-input-group">
                                    <label>Cierre</label>
                                    <input
                                      type="time"
                                      value={horario.cierre}
                                      onChange={(e) => actualizarHorario(dia.id, index, 'cierre', e.target.value)}
                                      className="time-input"
                                      disabled={!horario.abierto}
                                    />
                                  </div>
                                </div>
                                
                                <button
                                  onClick={() => eliminarHorario(dia.id, index)}
                                  className="btn-eliminar-horario"
                                  disabled={horariosDia.length === 1}
                                  title="Eliminar horario"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                          
                          <div className="horarios-actions">
                            <button
                              onClick={() => agregarHorario(dia.id)}
                              className="btn-agregar-horario"
                            >
                              <Plus size={16} />
                              Agregar otro horario
                            </button>
                            
                            <button
                              onClick={() => copiarHorarios(dia.id)}
                              className="btn-copiar"
                            >
                              Copiar a todos los días
                            </button>
                          </div>
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
            <button 
              onClick={resetearCambios}
              className="btn-cancelar"
              disabled={!hayCambios}
            >
              Descartar cambios
            </button>
            <button 
              onClick={handleGuardarHorarios}
              disabled={guardando || !hayCambios}
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
