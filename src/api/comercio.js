import { API_CONFIG } from '../config/config.js';
import { getToken } from './auth.js'; // Ahora existe

// Función para hacer requests autenticados
async function authFetch(url, options = {}) {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_CONFIG.BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Error en la petición');
  }

  // ✅ Manejar respuestas que pueden ser texto plano o JSON
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  } else {
    // Si no es JSON, devolver el texto de la respuesta
    const textResponse = await response.text();
    console.log('📄 Respuesta del servidor (texto):', textResponse);
    return { message: textResponse, success: true };
  }
}

// Servicios para comercios
export const comerciosService = {
  // Obtener todos los comercios
  getAll: () => authFetch(API_CONFIG.ENDPOINTS.COMERCIOS.BASE),
  
  // Obtener comercio por ID
  getById: (id) => authFetch(`${API_CONFIG.ENDPOINTS.COMERCIOS.BASE}/${id}`),
  
  // Crear comercio
  create: (data) => authFetch(API_CONFIG.ENDPOINTS.COMERCIOS.BASE, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Actualizar comercio
  update: (id, data) => authFetch(`${API_CONFIG.ENDPOINTS.COMERCIOS.BASE}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Eliminar comercio
  delete: (id) => authFetch(`${API_CONFIG.ENDPOINTS.COMERCIOS.BASE}/${id}`, {
    method: 'DELETE',
  }),
  
  // Obtener comercios destacados
  getDestacados: () => authFetch(API_CONFIG.ENDPOINTS.COMERCIOS.DESTACADOS),
  
  // Obtener comercios por ciudad
  getByCiudad: (ciudad) => authFetch(`${API_CONFIG.ENDPOINTS.COMERCIOS.BY_CIUDAD}/${ciudad}`),
  
  // Obtener productos de un comercio
  getProductos: (id) => authFetch(`${API_CONFIG.ENDPOINTS.COMERCIOS.BASE}/${id}/productos`),
  
  // Obtener categorías de un comercio
  getCategorias: (id) => authFetch(`${API_CONFIG.ENDPOINTS.COMERCIOS.BASE}/${id}/categorias`),

    getMiPerfil: () => authFetch(API_CONFIG.ENDPOINTS.COMERCIOS.MI_PERFIL),
  
  // Actualizar perfil del comercio actual
  updateMiPerfil: (data) => authFetch(API_CONFIG.ENDPOINTS.COMERCIOS.MI_PERFIL, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Obtener comercio por ID (si necesitas específico)
  getById: (id) => authFetch(`${API_CONFIG.ENDPOINTS.COMERCIOS.BASE}/${id}`),
  
  // Actualizar comercio por ID
  update: (id, data) => authFetch(`${API_CONFIG.ENDPOINTS.COMERCIOS.BASE}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

// Servicios para horarios
export const horariosService = {
  getAll: () => authFetch(API_CONFIG.ENDPOINTS.HORARIOS),
};

