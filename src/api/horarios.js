// src/api/horarios.js - VERSIÓN CORREGIDA Y TERMINADA
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
  if (!response.ok) {
    let errorMessage;
    
    switch (response.status) {
      case 401:
        errorMessage = 'No autorizado';
        break;
      case 404:
        errorMessage = 'Recurso no encontrado';
        break;
      case 500:
        errorMessage = 'Error interno del servidor';
        break;
      default:
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || `Error ${response.status}`;
        } catch {
          errorMessage = `Error ${response.status}`;
        }
    }
    
    throw new Error(errorMessage);
  }
  
  return response;
};

// Función para crear objeto TimeSpan que espera el backend
const crearTimeSpan = (horaString) => {
  if (!horaString) {
    return {
      ticks: 0,
      days: 0,
      hours: 9,
      minutes: 0,
      seconds: 0,
      milliseconds: 0
    };
  }
  
  // Si viene como "08:30" o "08:30:00"
  const parts = horaString.split(':');
  const hours = parseInt(parts[0]) || 9;
  const minutes = parseInt(parts[1]) || 0;
  
  return {
    ticks: 0,
    days: 0,
    hours: hours,
    minutes: minutes,
    seconds: 0,
    milliseconds: 0
  };
};

// Obtener horarios por comercio
export const getHorariosByComercio = async (comercioId) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log(`🕒 Obteniendo horarios para comercio ${comercioId}...`);
    
    const url = `http://localhost:5189/api/ComercioHorarios/${comercioId}/list`;
    
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

// Crear horario - CORREGIDO
export const crearHorario = async (horarioData) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('🆕 Creando nuevo horario con datos:', horarioData);
    
    // FORMATO CORRECTO para el backend
    const requestBody = {
      apertura: crearTimeSpan(horarioData.apertura),
      cierre: crearTimeSpan(horarioData.cierre),
      dias: horarioData.dias, // Ya debe venir formateado como "Lunes,Martes"
      abierto: horarioData.abierto !== undefined ? horarioData.abierto : true
    };
    
    console.log('📤 Enviando al backend:', requestBody);
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/Horarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response:', errorText);
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Horario creado:', data);
    return data;
    
  } catch (error) {
    console.error('💥 Error en crearHorario:', error);
    throw error;
  }
};

// Eliminar horario
export const eliminarHorario = async (id) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('🗑️ Eliminando horario...', { id });
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/Horarios/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    await handleResponse(response);
    console.log('✅ Horario eliminado');
    return true;
    
  } catch (error) {
    console.error('💥 Error en eliminarHorario:', error);
    throw error;
  }
};

// Asignar horario existente a comercio - CORREGIDO
export const asignarHorarioAComercio = async (comercioId, horarioId) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log(`🔗 Asignando horario ${horarioId} al comercio ${comercioId}...`);
    
    // ✅ USAR ENDPOINT CORRECTO
    const url = `http://localhost:5189/api/ComercioHorarios/${comercioId}/add/${horarioId}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Horario asignado al comercio:', data);
    return data;
    
  } catch (error) {
    console.error('💥 Error en asignarHorarioAComercio:', error);
    throw error;
  }
};

// Quitar horario de comercio - CORREGIDO
export const quitarHorarioDeComercio = async (comercioId, horarioId) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log(`🚫 Quitando horario ${horarioId} del comercio ${comercioId}...`);
    
    // ✅ USAR ENDPOINT CORRECTO
    const url = `http://localhost:5189/api/ComercioHorarios/${comercioId}/remove/${horarioId}`;
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Horario quitado del comercio:', data);
    return data;
    
  } catch (error) {
    console.error('💥 Error en quitarHorarioDeComercio:', error);
    throw error;
  }
};

// Verificar si comercio está abierto
export const verificarComercioAbierto = async (comercioId) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log(`🔍 Verificando si comercio ${comercioId} está abierto...`);
    
    const url = `http://localhost:5189/api/ComercioHorarios/${comercioId}/abierto`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log('✅ Estado del comercio:', data);
    return data.abierto || false;
    
  } catch (error) {
    console.warn('⚠️ No se pudo verificar estado del comercio:', error.message);
    throw error;
  }
};

// Crear y asignar horario a comercio - CORREGIDO
export const crearYAsignarHorario = async (comercioId, horarioData) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log(`➕ Creando y asignando horario al comercio ${comercioId}...`);
    
    // 1. Primero crear el horario
    const horarioCreado = await crearHorario(horarioData);
    
    // 2. Luego asignarlo al comercio
    if (horarioCreado && horarioCreado.idhorarios) {
      await asignarHorarioAComercio(comercioId, horarioCreado.idhorarios);
    }
    
    console.log('✅ Horario creado y asignado:', horarioCreado);
    return horarioCreado;
    
  } catch (error) {
    console.error('💥 Error en crearYAsignarHorario:', error);
    throw error;
  }
};

// Función para crear múltiples horarios a la vez - CORREGIDO
export const crearHorariosBatch = async (comercioId, horariosData) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log(`🔄 Creando horarios en batch para comercio ${comercioId}...`);
    
    const resultados = [];
    
    for (const horarioData of horariosData) {
      try {
        const resultado = await crearYAsignarHorario(comercioId, horarioData);
        resultados.push(resultado);
      } catch (error) {
        console.error('❌ Error creando horario individual:', error);
        // Continuar con los demás horarios
      }
    }
    
    console.log('✅ Horarios batch creados:', resultados);
    return resultados;
    
  } catch (error) {
    console.error('💥 Error creando horarios batch:', error);
    throw error;
  }
};

// Guardar horarios del comercio - COMPLETAMENTE CORREGIDO
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

    // 2. SOLO ELIMINAR RELACIONES, NO LOS HORARIOS
    for (const horario of horariosExistentes) {
      console.log(`🚫 Quitando relación: comercio ${comercioId} - horario ${horario.idhorarios}`);
      await quitarHorarioDeComercio(comercioId, horario.idhorarios);
      // NO ELIMINAR EL HORARIO: await eliminarHorario(horario.idhorarios);
    }

    // 3. Preparar nuevos horarios en formato CORRECTO
    const horariosParaGuardar = [];
    
    for (const [diaId, horariosDia] of Object.entries(horariosEditados)) {
      for (const horario of horariosDia) {
        if (horario.abierto) {
          // FORMATO CORRECTO: Un horario por cada combinación día+apertura+cierre
          horariosParaGuardar.push({
            apertura: horario.apertura, // Ya viene como "08:30"
            cierre: horario.cierre,     // Ya viene como "18:00"
            dias: DIAS_MAP[parseInt(diaId)] || 'Lunes', // "Lunes", "Martes", etc.
            abierto: true
          });
        }
      }
    }

    console.log('📤 Enviando horarios al backend:', horariosParaGuardar);

    // 4. Si no hay horarios para guardar, retornar éxito
    if (horariosParaGuardar.length === 0) {
      console.log('ℹ️ No hay horarios para guardar, comercio permanecerá cerrado');
      return { 
        success: true, 
        message: 'Comercio configurado como cerrado', 
        data: [] 
      };
    }

    // 5. Crear todos los horarios nuevos y asignarlos
    const resultados = await crearHorariosBatch(comercioId, horariosParaGuardar);

    console.log('✅ Horarios guardados exitosamente:', resultados);
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

// Función auxiliar para formatear horas para comparación
const formatearHoraParaComparar = (timeSpan) => {
  if (!timeSpan) return '00:00';
  
  if (typeof timeSpan === 'string') {
    const parts = timeSpan.split(':');
    return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
  }
  
  // Si es objeto TimeSpan
  if (typeof timeSpan === 'object' && timeSpan.hours !== undefined) {
    const hours = timeSpan.hours.toString().padStart(2, '0');
    const minutes = timeSpan.minutes.toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  
  return '00:00';
};

// Función auxiliar para determinar si el comercio está abierto (cálculo local)
export const calcularComercioAbierto = (horarios) => {
  if (!horarios || horarios.length === 0) return false;
  
  const ahora = new Date();
  const diaActual = ahora.getDay(); // 0 = Domingo, 1 = Lunes, etc.
  const diaActualNombre = DIAS_MAP[diaActual];
  const horaActual = ahora.getHours().toString().padStart(2, '0') + ':' + 
                     ahora.getMinutes().toString().padStart(2, '0');
  
  console.log('📅 Verificando horarios localmente:', {
    diaActual,
    diaActualNombre,
    horaActual,
    totalHorarios: horarios.length
  });
  
  // Buscar horarios para el día actual
  const horariosHoy = horarios.filter(horario => {
    if (!horario.dias) return false;
    
    const diasArray = horario.dias.split(',').map(d => d.trim());
    const coincideDia = diasArray.includes(diaActualNombre);
    
    return coincideDia && horario.abierto;
  });
  
  console.log('📋 Horarios para hoy:', horariosHoy);
  
  // Verificar si algún horario está activo ahora
  const estaAbierto = horariosHoy.some(horario => {
    const apertura = formatearHoraParaComparar(horario.apertura);
    const cierre = formatearHoraParaComparar(horario.cierre);
    
    console.log('⏰ Comparando:', {
      apertura,
      cierre,
      horaActual,
      dentroHorario: horaActual >= apertura && horaActual <= cierre
    });
    
    return horaActual >= apertura && horaActual <= cierre;
  });
  
  console.log('🏪 Comercio abierto (cálculo local):', estaAbierto);
  return estaAbierto;
};

// Función auxiliar para formatear hora de TimeSpan a HH:MM
export const formatearHoraDesdeTimeSpan = (timeSpan) => {
  if (!timeSpan) return '09:00';
  
  if (typeof timeSpan === 'string') {
    // Si ya viene en formato HH:MM
    if (timeSpan.length === 5 && timeSpan.includes(':')) {
      return timeSpan;
    }
    
    // Si viene como "08:30:00"
    const parts = timeSpan.split(':');
    if (parts.length >= 2) {
      return `${parts[0].padStart(2, '0')}:${parts[1]}`;
    }
  }
  
  // Si es objeto TimeSpan
  if (typeof timeSpan === 'object' && timeSpan.hours !== undefined) {
    const hours = timeSpan.hours.toString().padStart(2, '0');
    const minutes = timeSpan.minutes.toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  
  return '09:00';
};