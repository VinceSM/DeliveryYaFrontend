// src/hooks/useHorarios.jsx - VERSIÓN CORREGIDA Y SIN ERRORES
import { useState, useEffect, useCallback } from 'react';
import { 
  getHorariosByComercio, 
  calcularComercioAbierto, 
  guardarHorariosComercio,
  verificarComercioAbierto,
  formatearHoraDesdeTimeSpan 
} from '../api/horarios';

export const useHorarios = (comercioId) => {
  const [horarios, setHorarios] = useState([]);
  const [comercioAbierto, setComercioAbierto] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Días de la semana
  const diasSemana = [
    { id: 0, nombre: 'Domingo', corto: 'DOM' },
    { id: 1, nombre: 'Lunes', corto: 'LUN' },
    { id: 2, nombre: 'Martes', corto: 'MAR' },
    { id: 3, nombre: 'Miércoles', corto: 'MIE' },
    { id: 4, nombre: 'Jueves', corto: 'JUE' },
    { id: 5, nombre: 'Viernes', corto: 'VIE' },
    { id: 6, nombre: 'Sábado', corto: 'SAB' }
  ];

  // Mapeo de días numéricos a nombres (para el backend)
  const DIAS_MAP = {
    0: 'Domingo',
    1: 'Lunes', 
    2: 'Martes',
    3: 'Miércoles',
    4: 'Jueves', 
    5: 'Viernes',
    6: 'Sábado'
  };

  // Formatear hora de TimeSpan a HH:MM
  const formatearHora = useCallback((timeSpan) => {
    return formatearHoraDesdeTimeSpan(timeSpan);
  }, []);

  // Obtener horarios iniciales por defecto
  const getHorariosIniciales = useCallback(() => {
    const horariosIniciales = {};
    
    diasSemana.forEach(dia => {
      horariosIniciales[dia.id] = [{ 
        id: null, 
        apertura: '09:00', 
        cierre: '18:00', 
        abierto: false 
      }];
    });
    
    return horariosIniciales;
  }, [diasSemana]);

  // Obtener estructura de horarios para la UI
  const getEstructuraHorariosUI = useCallback(() => {
    if (!horarios || horarios.length === 0) {
      return getHorariosIniciales();
    }
    
    const estructura = {};
    
    diasSemana.forEach(dia => {
      const diaNombre = DIAS_MAP[dia.id];
      
      const horariosDia = horarios.filter(h => {
        if (!h.dias) return false;
        const diasArray = h.dias.split(',').map(d => d.trim());
        return diasArray.includes(diaNombre) && h.abierto;
      });
      
      if (horariosDia.length > 0) {
        estructura[dia.id] = horariosDia.map(h => ({
          id: h.idhorarios || h.id,
          apertura: formatearHora(h.apertura),
          cierre: formatearHora(h.cierre),
          abierto: true
        }));
      } else {
        estructura[dia.id] = [{ 
          id: null, 
          apertura: '09:00', 
          cierre: '18:00', 
          abierto: false 
        }];
      }
    });
    
    console.log('🎨 Estructura de horarios para UI:', estructura);
    return estructura;
  }, [horarios, diasSemana, DIAS_MAP, formatearHora, getHorariosIniciales]);

  // Cargar horarios del comercio
  const cargarHorarios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔄 Cargando horarios para comercio ${comercioId}...`);
      
      let horariosData = [];
      let estaAbierto = false;
      
      try {
        horariosData = await getHorariosByComercio(comercioId);
        console.log('✅ Horarios cargados del backend:', horariosData);
        
        try {
          estaAbierto = await verificarComercioAbierto(comercioId);
          console.log('✅ Estado del comercio desde backend:', estaAbierto);
        } catch (estadoError) {
          console.warn('⚠️ No se pudo verificar estado del backend, calculando localmente:', estadoError.message);
          estaAbierto = calcularComercioAbierto(horariosData);
        }
        
      } catch (backendError) {
        console.warn('⚠️ No se pudieron cargar horarios del backend:', backendError.message);
        horariosData = [];
        estaAbierto = false;
      }
      
      setHorarios(horariosData);
      setComercioAbierto(estaAbierto);
      
    } catch (err) {
      console.error('❌ Error crítico cargando horarios:', err);
      setError('Error al cargar los horarios. Por favor, intenta nuevamente.');
      setHorarios([]);
      setComercioAbierto(false);
    } finally {
      setLoading(false);
    }
  }, [comercioId]);

  // Guardar horarios editados
  const guardarHorarios = useCallback(async (horariosEditados) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('💾 Intentando guardar horarios...', horariosEditados);

      const erroresValidacion = validarHorarios(horariosEditados);
      if (erroresValidacion.length > 0) {
        throw new Error(erroresValidacion.join(', '));
      }

      console.log('📤 Enviando horarios directamente al backend...');

      let resultado;
      try {
        resultado = await guardarHorariosComercio(comercioId, horariosEditados);
        console.log('✅ Horarios guardados en backend:', resultado);
      } catch (backendError) {
        console.error('❌ No se pudieron guardar horarios en el backend:', backendError.message);
        throw new Error(`No se pudieron guardar los horarios: ${backendError.message}`);
      }

      await cargarHorarios();
      
      return resultado;
      
    } catch (err) {
      console.error('❌ Error guardando horarios:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [comercioId, cargarHorarios]);

  // Validar horarios antes de guardar
  const validarHorarios = useCallback((horariosEditados) => {
    const errores = [];
    
    for (const [diaId, horariosDia] of Object.entries(horariosEditados)) {
      const diaNombre = diasSemana.find(d => d.id === parseInt(diaId))?.nombre;
      const horariosActivos = horariosDia.filter(h => h.abierto);
      
      if (horariosActivos.length === 0) {
        continue;
      }
      
      for (let i = 0; i < horariosActivos.length; i++) {
        const horario1 = horariosActivos[i];
        
        if (!horario1.apertura || !horario1.cierre) {
          errores.push(`En ${diaNombre}: horas incompletas`);
          continue;
        }
        
        if (horario1.apertura >= horario1.cierre) {
          errores.push(`En ${diaNombre}: la hora de cierre (${horario1.cierre}) debe ser posterior a la de apertura (${horario1.apertura})`);
        }
        
        for (let j = i + 1; j < horariosActivos.length; j++) {
          const horario2 = horariosActivos[j];
          
          const superponen = (
            (horario1.apertura <= horario2.cierre && horario1.cierre >= horario2.apertura) ||
            (horario2.apertura <= horario1.cierre && horario2.cierre >= horario1.apertura)
          );
          
          if (superponen) {
            errores.push(`En ${diaNombre}: los horarios ${horario1.apertura}-${horario1.cierre} y ${horario2.apertura}-${horario2.cierre} se superponen`);
          }
        }
      }
    }
    
    return errores;
  }, [diasSemana]);

  // Verificar si hay cambios sin guardar
  const hayCambiosSinGuardar = useCallback((horariosEditados) => {
    const estructuraActual = getEstructuraHorariosUI();
    
    for (const diaId in estructuraActual) {
      const horariosActuales = estructuraActual[diaId];
      const horariosEditadosDia = horariosEditados[diaId] || [];
      
      if (horariosActuales.length !== horariosEditadosDia.length) {
        return true;
      }
      
      for (let i = 0; i < horariosActuales.length; i++) {
        const actual = horariosActuales[i];
        const editado = horariosEditadosDia[i];
        
        if (!editado) return true;
        
        if (actual.abierto !== editado.abierto ||
            actual.apertura !== editado.apertura ||
            actual.cierre !== editado.cierre) {
          return true;
        }
      }
    }
    
    return false;
  }, [getEstructuraHorariosUI]);

  // Recargar horarios
  const recargarHorarios = useCallback(async () => {
    await cargarHorarios();
  }, [cargarHorarios]);

  // Limpiar error
  const limpiarError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    if (comercioId) {
      cargarHorarios();
    }
  }, [comercioId, cargarHorarios]);

  return {
    // Estado
    horarios,
    comercioAbierto,
    diasSemana,
    loading,
    error,
    
    // Utilidades
    formatearHora,
    getEstructuraHorariosUI,
    getHorariosIniciales,
    hayCambiosSinGuardar,
    
    // Acciones
    recargarHorarios,
    cargarHorarios,
    guardarHorarios,
    limpiarError,
    
    // Métodos de validación
    validarHorarios
  };
};