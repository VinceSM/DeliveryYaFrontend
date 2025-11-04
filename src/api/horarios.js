// src/api/horarios.js - VERSIÓN CORREGIDA
import { API_CONFIG } from '../config/config.js';
import { getToken } from './auth.js';

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

export const guardarHorariosComercio = async (comercioId, horariosEditados) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log(`💾 Guardando horarios para comercio ${comercioId}...`, horariosEditados);

    // Primero, obtener horarios existentes para saber cuáles eliminar
    const horariosExistentes = await getHorariosByComercio(comercioId);
    
    // Eliminar horarios existentes
    for (const horario of horariosExistentes) {
      await eliminarHorario(horario.idhorarios);
    }

    // Crear nuevos horarios
    const resultados = [];
    
    for (const [diaId, horariosDia] of Object.entries(horariosEditados)) {
      for (const horario of horariosDia) {
        if (horario.abierto) {
          const horarioData = {
            apertura: convertirHoraATimeSpan(horario.apertura),
            cierre: convertirHoraATimeSpan(horario.cierre),
            dias: diaId.toString(), // Solo un día por horario para simplificar
            abierto: true
          };
          
          const resultado = await crearYAsignarHorario(comercioId, horarioData);
          resultados.push(resultado);
        }
      }
    }

    console.log('✅ Horarios guardados exitosamente:', resultados);
    return { success: true, message: 'Horarios guardados correctamente' };
    
  } catch (error) {
    console.error('💥 Error guardando horarios:', error);
    throw error;
  }
};

// Función auxiliar para convertir HH:MM a TimeSpan
const convertirHoraATimeSpan = (hora) => {
  if (!hora) return '08:00:00';
  
  // Si ya viene en formato TimeSpan
  if (hora.includes(':') && hora.split(':').length === 3) {
    return hora;
  }
  
  // Convertir de HH:MM a HH:MM:00
  return `${hora}:00`;
};

// Función para crear múltiples horarios a la vez
export const crearHorariosBatch = async (comercioId, horariosData) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log(`🔄 Creando horarios en batch para comercio ${comercioId}...`);
    
    const resultados = [];
    
    for (const horarioData of horariosData) {
      const resultado = await crearYAsignarHorario(comercioId, horarioData);
      resultados.push(resultado);
    }
    
    console.log('✅ Horarios batch creados:', resultados);
    return resultados;
    
  } catch (error) {
    console.error('💥 Error creando horarios batch:', error);
    throw error;
  }
};

// Función auxiliar para formatear horas para comparación
const formatearHoraParaComparar = (timeSpan) => {
  if (!timeSpan) return '00:00';
  
  if (typeof timeSpan === 'string') {
    // Si viene como "08:30:00" o "8:30:00"
    const parts = timeSpan.split(':');
    return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
  }
  
  return '00:00';
};

// Función auxiliar para determinar si el comercio está abierto
// Como no hay endpoint específico, lo calculamos en el frontend
export const calcularComercioAbierto = (horarios) => {
  if (!horarios || horarios.length === 0) return false;
  
  const ahora = new Date();
  const diaActual = ahora.getDay(); // 0 = Domingo, 1 = Lunes, etc.
  const horaActual = ahora.getHours().toString().padStart(2, '0') + ':' + 
                     ahora.getMinutes().toString().padStart(2, '0');
  
  console.log('📅 Verificando horarios:', {
    diaActual,
    horaActual,
    totalHorarios: horarios.length
  });
  
  // Buscar horarios para el día actual
  const horariosHoy = horarios.filter(horario => {
    // Asumiendo que horario.dias contiene el número del día como string
    const diasArray = horario.dias ? horario.dias.split(',').map(d => d.trim()) : [];
    const coincideDia = diasArray.includes(diaActual.toString());
    
    console.log('🔍 Horario:', {
      dias: horario.dias,
      diasArray,
      diaActual: diaActual.toString(),
      coincideDia,
      abierto: horario.abierto
    });
    
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
  
  console.log('🏪 Comercio abierto:', estaAbierto);
  return estaAbierto;
};

// Obtener horarios por comercio
export const getHorariosByComercio = async (comercioId) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log(`🕒 Obteniendo horarios para comercio ${comercioId}...`);
    
    const url = `${API_CONFIG.BASE_URL}/api/Horarios/comercio/${comercioId}`;
    console.log('🔗 URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    await handleResponse(response);
    const data = await response.json();
    
    console.log('✅ Horarios por comercio obtenidos:', data);
    return Array.isArray(data) ? data : [];
    
  } catch (error) {
    console.error('💥 Error en getHorariosByComercio:', error);
    throw error;
  }
};

// Crear horario
export const crearHorario = async (horarioData) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('🆕 Creando nuevo horario...', horarioData);
    
    const requestBody = {
      Apertura: horarioData.apertura,
      Cierre: horarioData.cierre,
      Dias: horarioData.dias,
      Abierto: horarioData.abierto
    };
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/Horarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody),
    });

    await handleResponse(response);
    const data = await response.json();
    
    console.log('✅ Horario creado:', data);
    return data;
    
  } catch (error) {
    console.error('💥 Error en crearHorario:', error);
    throw error;
  }
};

// Actualizar horario
export const actualizarHorario = async (id, horarioData) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('✏️ Actualizando horario...', { id, horarioData });
    
    const requestBody = {
      IdHorario: id,
      Apertura: horarioData.apertura,
      Cierre: horarioData.cierre,
      Dias: horarioData.dias,
      Abierto: horarioData.abierto
    };
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/Horarios/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody),
    });

    await handleResponse(response);
    console.log('✅ Horario actualizado');
    return true;
    
  } catch (error) {
    console.error('💥 Error en actualizarHorario:', error);
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

// Crear y asignar horario a comercio (endpoint combinado)
export const crearYAsignarHorario = async (comercioId, horarioData) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log(`➕ Creando y asignando horario al comercio ${comercioId}...`);
    
    const requestBody = {
      Apertura: horarioData.apertura,
      Cierre: horarioData.cierre,
      Dias: horarioData.dias,
      Abierto: horarioData.abierto
    };
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/Horarios/comercio/${comercioId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody),
    });

    await handleResponse(response);
    const data = await response.json();
    
    console.log('✅ Horario creado y asignado:', data);
    return data;
    
  } catch (error) {
    console.error('💥 Error en crearYAsignarHorario:', error);
    throw error;
  }
};