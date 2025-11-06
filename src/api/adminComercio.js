// src/api/adminComercio.js
import { API_CONFIG } from '../config/config.js';
import { getAdminToken } from './adminAuth.js';
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
    let errorText;
    try {
      errorText = await response.text();
      console.error('❌ Error en respuesta:', errorText);
    } catch (e) {
      errorText = `Error ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorText);
  }
};

// Mapear datos del backend al frontend
const mapearComercioDesdeBackend = (comercioData) => {
  return {
    idComercio: comercioData.id || comercioData.idComercio || comercioData.idcomercio,
    nombreComercio: comercioData.nombreComercio,
    tipoComercio: comercioData.tipoComercio,
    ciudad: comercioData.ciudad,
    destacado: comercioData.destacado || false,
    createdAt: comercioData.createdAt,
    estado: comercioData.createdAt ? 'activo' : 'pendiente',
    // Para el detalle
    eslogan: comercioData.eslogan,
    fotoPortada: comercioData.fotoPortada,
    envio: comercioData.envio,
    deliveryPropio: comercioData.deliveryPropio,
    celular: comercioData.celular,
    calle: comercioData.calle,
    numero: comercioData.numero,
    sucursales: comercioData.sucursales,
    latitud: comercioData.latitud,
    longitud: comercioData.longitud,
    encargado: comercioData.encargado,
    cvu: comercioData.cvu,
    alias: comercioData.alias,
    updatedAt: comercioData.updatedAt
  };
};

// Obtener comercios pendientes de aprobación
export const getComerciosPendientes = async () => {
  try {
    console.log('🔐 === INICIANDO getComerciosPendientes ===');
    
    const token = getAdminToken(); // ✅ CAMBIAR: getToken → getAdminToken
    console.log('🔐 Token obtenido:', token);
    console.log('🔐 Token existe:', !!token);
    
    if (!token) {
      console.error('❌ NO HAY TOKEN DISPONIBLE');
      console.log('🔐 localStorage completo:', { ...localStorage });
      throw new Error('No hay token de autenticación de administrador. Token: ' + token);
    }

    console.log('📋 Obteniendo comercios pendientes...');
    
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN_COMERCIOS.PENDIENTES}`;
    console.log('🔗 URL:', url);
    
    console.log('🔐 Headers:', {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    console.log('📥 Status de respuesta:', response.status);
    console.log('📥 Headers de respuesta:', response.headers);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error HTTP:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Comercios pendientes obtenidos:', data);
    
    const comerciosMapeados = Array.isArray(data) 
      ? data.map(mapearComercioDesdeBackend)
      : [];
    
    return comerciosMapeados;
    
  } catch (error) {
    console.error('💥 Error en getComerciosPendientes:', error);
    throw error;
  }
};

// Obtener comercios activos
export const getComerciosActivos = async () => {
  try {
    const token = getAdminToken(); // ✅ CAMBIAR: getToken → getAdminToken
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('🏪 Obteniendo comercios activos...');
    
    const url = buildUrl(API_CONFIG.ENDPOINTS.ADMIN_COMERCIOS.ACTIVOS);
    console.log('🔗 URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    console.log('📥 Status de respuesta comercios activos:', response.status);
    
    await handleResponse(response);

    const data = await response.json();
    console.log('✅ Comercios activos obtenidos:', data);
    
    const comerciosMapeados = Array.isArray(data) 
      ? data.map(mapearComercioDesdeBackend)
      : [];
    
    return comerciosMapeados;
    
  } catch (error) {
    console.error('💥 Error en getComerciosActivos:', error);
    throw error;
  }
};

// Aprobar comercio
export const aprobarComercio = async (idComercio) => {
  try {
    const token = getAdminToken(); // ✅ CAMBIAR: getToken → getAdminToken
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('✅ Aprobando comercio...', { idComercio });
    
    const url = buildUrl(API_CONFIG.ENDPOINTS.ADMIN_COMERCIOS.APROBAR, { 
      id: idComercio 
    });
    console.log('🔗 URL:', url);
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    console.log('📥 Status de respuesta aprobar comercio:', response.status);
    
    await handleResponse(response);

    const data = await response.json();
    console.log('✅ Comercio aprobado:', data);
    
    return mapearComercioDesdeBackend(data);
    
  } catch (error) {
    console.error('💥 Error en aprobarComercio:', error);
    throw error;
  }
};

// Destacar/Desdestacar comercio
export const destacarComercio = async (idComercio, destacado) => {
  try {
    const token = getAdminToken(); // ✅ CAMBIAR: getToken → getAdminToken
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('⭐ Destacando comercio...', { idComercio, destacado });
    
    const url = `${buildUrl(API_CONFIG.ENDPOINTS.ADMIN_COMERCIOS.DESTACAR, { 
      id: idComercio 
    })}?destacado=${destacado}`;
    
    console.log('🔗 URL:', url);
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    console.log('📥 Status de respuesta destacar comercio:', response.status);
    
    await handleResponse(response);

    const data = await response.json();
    console.log('✅ Comercio destacado:', data);
    
    return mapearComercioDesdeBackend(data);
    
  } catch (error) {
    console.error('💥 Error en destacarComercio:', error);
    throw error;
  }
};

// Obtener detalle del comercio
export const getDetalleComercio = async (idComercio) => {
  try {
    const token = getAdminToken(); // ✅ CAMBIAR: getToken → getAdminToken
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('🔍 Obteniendo detalle del comercio...', { idComercio });
    
    const url = buildUrl(API_CONFIG.ENDPOINTS.ADMIN_COMERCIOS.DETALLE, { 
      id: idComercio 
    });
    console.log('🔗 URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    console.log('📥 Status de respuesta detalle comercio:', response.status);
    
    await handleResponse(response);

    const data = await response.json();
    console.log('✅ Detalle del comercio obtenido:', data);
    
    return mapearComercioDesdeBackend(data);
    
  } catch (error) {
    console.error('💥 Error en getDetalleComercio:', error);
    throw error;
  }
};

// Obtener todos los comercios (pendientes + activos)
export const getAllComercios = async () => {
  try {
    console.log('📊 Obteniendo todos los comercios...');
    
    const [pendientes, activos] = await Promise.all([
      getComerciosPendientes(),
      getComerciosActivos()
    ]);
    
    const todosLosComercios = [...pendientes, ...activos];
    console.log('✅ Todos los comercios obtenidos:', {
      pendientes: pendientes.length,
      activos: activos.length,
      total: todosLosComercios.length
    });
    
    return todosLosComercios;
    
  } catch (error) {
    console.error('💥 Error en getAllComercios:', error);
    throw error;
  }
};

// Desactivar comercio
export const desactivarComercio = async (idComercio) => {
  try {
    const token = getAdminToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('❌ Desactivando comercio...', { idComercio });
    
    const url = buildUrl(API_CONFIG.ENDPOINTS.ADMIN_COMERCIOS.DESACTIVAR, { 
      id: idComercio 
    });
    console.log('🔗 URL:', url);
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    console.log('📥 Status de respuesta desactivar comercio:', response.status);
    
    await handleResponse(response);

    const data = await response.json();
    console.log('✅ Comercio desactivado:', data);
    
    return mapearComercioDesdeBackend(data);
    
  } catch (error) {
    console.error('💥 Error en desactivarComercio:', error);
    throw error;
  }
};