// src/api/horarios.js - VERSIÓN CORREGIDA PARA TIMESPAN
import { API_CONFIG } from '../config/config.js';
import { getToken } from './auth.js';

// Mapeo de días numéricos a nombres
const DIAS_MAP = {
  0: 'Domingo',
  1: 'Lunes', 
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves', 
  5: 'Viernes',
  6: 'Sábado'
};

// Función para construir URLs
const buildUrl = (endpoint, params = {}) => {
  let url = `${API_CONFIG.BASE_URL}${endpoint}`;
  Object.keys(params).forEach(key => {
    url = url.replace(`{${key}}`, encodeURIComponent(params[key]));
  });
  return url;
};

// Función auxiliar para manejar respuestas
const handleResponse = async (response) => {
  console.log('📨 Response status:', response.status);
  
  if (!response.ok) {
    let errorMessage;
    let errorDetails = '';
    
    try {
      const errorData = await response.json();
      errorDetails = JSON.stringify(errorData);
      errorMessage = errorData.message || `Error ${response.status}`;
    } catch {
      errorMessage = `Error ${response.status}: ${response.statusText}`;
    }
    
    console.error('❌ Error response details:', errorDetails);
    throw new Error(errorMessage);
  }
  
  return response.json();
};

// TimeSpan espera formato: "HH:MM:SS" o "DD.HH:MM:SS"
const crearTimeSpanParaNET = (horaString) => {
  if (!horaString) return "09:00:00";
  
  // Asegurar formato HH:MM
  const [hoursStr, minutesStr] = horaString.split(':');
  const hours = parseInt(hoursStr) || 9;
  const minutes = parseInt(minutesStr) || 0;
  
  // Validar rangos
  const horasValidas = Math.max(0, Math.min(23, hours));
  const minutosValidos = Math.max(0, Math.min(59, minutes));
  
  // Formato: "HH:MM:00" - TimeSpan espera horas:minutos:segundos
  return `${horasValidas.toString().padStart(2, '0')}:${minutosValidos.toString().padStart(2, '0')}:00`;
};

// Obtener horarios por comercio
export const getHorariosByComercio = async (comercioId) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log(`🕒 Obteniendo horarios para comercio ${comercioId}...`);
    
    const url = buildUrl(API_CONFIG.ENDPOINTS.HORARIOS.BY_COMERCIO, { comercioId });
    
    console.log('🔗 URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.log('📭 El comercio no tiene horarios asignados, retornando array vacío');
        return [];
      }
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log('✅ Horarios por comercio obtenidos:', data);
    return Array.isArray(data) ? data : [];
    
  } catch (error) {
    console.warn('⚠️ No se pudieron obtener horarios del backend:', error.message);
    return [];
  }
};

// Crear horario para comercio - CORREGIDO
export const crearHorarioParaComercio = async (comercioId, horarioData) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log(`🆕 Creando horario para comercio ${comercioId}:`, horarioData);
    
    const url = buildUrl(API_CONFIG.ENDPOINTS.HORARIOS.CREATE, { comercioId });
    
    const datosParaBackend = {
      apertura: crearTimeSpanParaNET(horarioData.apertura), // "09:00:00"
      cierre: crearTimeSpanParaNET(horarioData.cierre),     // "18:00:00"
      dias: horarioData.dias,
      abierto: horarioData.abierto
    };
    
    console.log('📤 URL de creación:', url);
    console.log('📦 Datos enviados (FORMATO CORREGIDO):', datosParaBackend);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(datosParaBackend),
    });

    const data = await handleResponse(response);
    console.log('✅ Horario creado:', data);
    return data;
    
  } catch (error) {
    console.error('💥 Error en crearHorarioParaComercio:', error);
    throw error;
  }
};
// Eliminar horario
export const eliminarHorario = async (comercioId, horarioId) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log(`🗑️ Eliminando horario ${horarioId} del comercio ${comercioId}...`);
    
    const url = buildUrl(API_CONFIG.ENDPOINTS.HORARIOS.DELETE, { 
      comercioId, 
      horarioId 
    });
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    const data = await handleResponse(response);
    console.log('✅ Horario eliminado:', data);
    return data;
    
  } catch (error) {
    console.error('💥 Error en eliminarHorario:', error);
    throw error;
  }
};

// Guardar horarios del comercio
export const guardarHorariosComercio = async (comercioId, horariosEditados) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log(`💾 Guardando horarios para comercio ${comercioId}...`, horariosEditados);

    // 1. Obtener horarios existentes del comercio
    const horariosExistentes = await getHorariosByComercio(comercioId);
    console.log('📋 Horarios existentes:', horariosExistentes);

    // 2. Eliminar horarios existentes que ya no se necesitan
    for (const horarioExistente of horariosExistentes) {
      console.log(`🗑️ Eliminando horario existente: ${horarioExistente.idhorarios}`);
      try {
        await eliminarHorario(comercioId, horarioExistente.idhorarios);
      } catch (error) {
        console.warn('⚠️ No se pudo eliminar horario existente:', error.message);
      }
    }

    // 3. Preparar nuevos horarios en formato CORREGIDO
    const horariosParaGuardar = [];
    
    for (const [diaId, horariosDia] of Object.entries(horariosEditados)) {
      for (const horario of horariosDia) {
        if (horario.abierto) {
          const horarioParaBackend = {
            apertura: horario.apertura, // Se convertirá a "HH:MM:00"
            cierre: horario.cierre,     // Se convertirá a "HH:MM:00"  
            dias: DIAS_MAP[parseInt(diaId)] || 'Lunes',
            abierto: true
          };
          
          console.log(`📝 Preparando horario para ${DIAS_MAP[parseInt(diaId)]}:`, horarioParaBackend);
          horariosParaGuardar.push(horarioParaBackend);
        }
      }
    }

    console.log('📤 Total de horarios para guardar:', horariosParaGuardar.length);

    // 4. Si no hay horarios para guardar, retornar éxito
    if (horariosParaGuardar.length === 0) {
      console.log('ℹ️ No hay horarios para guardar, comercio permanecerá cerrado');
      return { 
        success: true, 
        message: 'Comercio configurado como cerrado', 
        data: [] 
      };
    }

    // 5. Crear todos los horarios nuevos CON FORMATO CORRECTO
    const resultados = [];
    for (const horarioData of horariosParaGuardar) {
      try {
        console.log('🚀 Creando horario individual:', horarioData);
        const resultado = await crearHorarioParaComercio(comercioId, horarioData);
        resultados.push(resultado);
        console.log('✅ Horario individual creado exitosamente');
      } catch (error) {
        console.error('❌ Error creando horario individual:', error.message);
        console.error('📋 Datos que fallaron:', horarioData);
        // Continuar con los demás horarios en lugar de fallar completamente
      }
    }

    console.log('✅ Horarios guardados exitosamente:', resultados.length);
    return { 
      success: true, 
      message: `${resultados.length} horarios guardados correctamente`, 
      data: resultados 
    };
    
  } catch (error) {
    console.error('💥 Error guardando horarios:', error);
    throw error;
  }
};
// Resto de funciones auxiliares...
export const formatearHoraDesdeTimeSpan = (timeSpan) => {
  if (!timeSpan) return '09:00';
  
  if (typeof timeSpan === 'string') {
    // Si viene como "09:00:00" desde el backend
    const parts = timeSpan.split(':');
    if (parts.length >= 2) {
      return `${parts[0].padStart(2, '0')}:${parts[1]}`;
    }
  }
  
  if (typeof timeSpan === 'object' && timeSpan.hours !== undefined) {
    const hours = timeSpan.hours.toString().padStart(2, '0');
    const minutes = timeSpan.minutes.toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  
  return '09:00';
};

export const calcularComercioAbierto = (horarios) => {
  if (!horarios || horarios.length === 0) return false;
  
  const ahora = new Date();
  const diaActual = ahora.getDay();
  const diaActualNombre = DIAS_MAP[diaActual];
  const horaActual = ahora.getHours().toString().padStart(2, '0') + ':' + 
                     ahora.getMinutes().toString().padStart(2, '0');
  
  const horariosHoy = horarios.filter(horario => {
    if (!horario.dias) return false;
    const diasArray = horario.dias.split(',').map(d => d.trim());
    return diasArray.includes(diaActualNombre) && horario.abierto;
  });
  
  const estaAbierto = horariosHoy.some(horario => {
    const apertura = formatearHoraDesdeTimeSpan(horario.apertura);
    const cierre = formatearHoraDesdeTimeSpan(horario.cierre);
    return horaActual >= apertura && horaActual <= cierre;
  });
  
  return estaAbierto;
};

export const verificarComercioAbierto = async (comercioId) => {
  try {
    const horarios = await getHorariosByComercio(comercioId);
    return calcularComercioAbierto(horarios);
  } catch (error) {
    console.warn('⚠️ No se pudo verificar estado del comercio:', error.message);
    return false;
  }
};