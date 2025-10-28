// src/api/horarios.js
import { API_CONFIG } from '../config/config.js';
import { getToken } from './auth.js';

// Función para construir URLs
const buildUrl = (endpoint, params = {}) => {
  // Si endpoint ya es una URL completa, retornarla directamente
  if (endpoint.startsWith('http')) {
    return endpoint;
  }
  
  let url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  // Reemplazar parámetros en la URL
  Object.keys(params).forEach(key => {
    url = url.replace(`{${key}}`, encodeURIComponent(params[key]));
  });
  
  return url;
};

// Manejo de respuestas
const handleResponse = async (response) => {
  console.log(`📥 Horarios - Status: ${response.status}`);
  
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
          const errorText = await response.text();
          errorMessage = errorText || `Error ${response.status}`;
        } catch {
          errorMessage = `Error ${response.status}`;
        }
    }
    
    throw new Error(errorMessage);
  }
  
  return response;
};

// Obtener todos los horarios
export const getHorarios = async () => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('🕒 Obteniendo horarios...');
    
    // ✅ CORREGIDO: Usar string directa en lugar de buildUrl con objeto
    const url = `${API_CONFIG.BASE_URL}/api/Horarios`;
    console.log('🔗 URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    console.log('📥 Horarios - Status:', response.status);
    
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
            const errorText = await response.text();
            errorMessage = errorText || `Error ${response.status}`;
          } catch {
            errorMessage = `Error ${response.status}`;
          }
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('✅ Horarios obtenidos:', data);
    
    return Array.isArray(data) ? data : [];
    
  } catch (error) {
    console.error('💥 Error en getHorarios:', error);
    throw error;
  }
};

// Obtener horarios por comercio
export const getHorariosByComercio = async (comercioId) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log(`🕒 Obteniendo horarios para comercio ${comercioId}...`);
    
    // ✅ CORREGIDO: URL directa
    const url = `${API_CONFIG.BASE_URL}/api/Horarios/comercio/${comercioId}`;
    console.log('🔗 URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    console.log('📥 Horarios por comercio - Status:', response.status);
    
    if (!response.ok) {
      let errorMessage;
      
      switch (response.status) {
        case 401:
          errorMessage = 'No autorizado';
          break;
        case 404:
          errorMessage = 'Comercio no encontrado';
          break;
        case 500:
          errorMessage = 'Error interno del servidor';
          break;
        default:
          try {
            const errorText = await response.text();
            errorMessage = errorText || `Error ${response.status}`;
          } catch {
            errorMessage = `Error ${response.status}`;
          }
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('✅ Horarios por comercio obtenidos:', data);
    
    return Array.isArray(data) ? data : [];
    
  } catch (error) {
    console.error('💥 Error en getHorariosByComercio:', error);
    throw error;
  }
};

// Verificar si el comercio está abierto
export const checkComercioAbierto = async (comercioId) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log(`🔍 Verificando estado del comercio ${comercioId}...`);
    
    // ✅ CORREGIDO: URL directa
    const url = `${API_CONFIG.BASE_URL}/api/Horarios/comercio/${comercioId}/abierto`;
    console.log('🔗 URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    console.log('📥 Estado comercio - Status:', response.status);
    
    if (!response.ok) {
      let errorMessage;
      
      switch (response.status) {
        case 401:
          errorMessage = 'No autorizado';
          break;
        case 404:
          errorMessage = 'Comercio no encontrado';
          break;
        case 500:
          errorMessage = 'Error interno del servidor';
          break;
        default:
          try {
            const errorText = await response.text();
            errorMessage = errorText || `Error ${response.status}`;
          } catch {
            errorMessage = `Error ${response.status}`;
          }
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('✅ Estado del comercio:', data);
    
    return data.Abierto || false;
    
  } catch (error) {
    console.error('💥 Error en checkComercioAbierto:', error);
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
    
    const response = await fetch(buildUrl(API_CONFIG.ENDPOINTS.HORARIOS), {
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
      Id: id,
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

// Agregar horario a comercio
export const agregarHorarioAComercio = async (comercioId, horarioId) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log(`➕ Agregando horario ${horarioId} al comercio ${comercioId}...`);
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/Horarios/comercio/${comercioId}/horario/${horarioId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    await handleResponse(response);
    
    console.log('✅ Horario agregado al comercio');
    return true;
    
  } catch (error) {
    console.error('💥 Error en agregarHorarioAComercio:', error);
    throw error;
  }
};