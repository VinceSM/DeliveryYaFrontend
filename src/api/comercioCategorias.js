// src/api/comercioCategorias.js - VERSIÓN CORREGIDA CON URLS ABSOLUTAS
import { API_CONFIG } from '../config/config.js';
import { getToken } from './auth.js';

// Función mejorada para manejar respuestas
const handleResponse = async (response) => {
  console.log('📨 Response status:', response.status);
  
  if (!response.ok) {
    let errorMessage;
    
    try {
      const errorText = await response.text();
      
      // Intentar parsear como JSON
      if (errorText.trim().startsWith('{') || errorText.trim().startsWith('[')) {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.mensaje || errorData.message || `Error ${response.status}`;
      } else {
        errorMessage = `Error ${response.status}: ${response.statusText}`;
      }
    } catch {
      errorMessage = `Error ${response.status}: ${response.statusText}`;
    }
    
    throw new Error(errorMessage);
  }
  
  return response.json();
};

// Obtener categorías de un comercio específico - VERSIÓN CORREGIDA
export const getCategoriasPorComercio = async (comercioId) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log(`📂 Obteniendo categorías del comercio ${comercioId}...`);
    
    // ✅ USAR URL ABSOLUTA CON EL PUERTO CORRECTO DEL BACKEND
    const url = `${API_CONFIG.BASE_URL}/api/comercios/${comercioId}/categorias`;
    console.log('🔗 URL absoluta:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    console.log('📥 Status:', response.status);
    
    if (response.status === 404) {
      console.log('📭 Endpoint no encontrado (404)');
      return [];
    }
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await handleResponse(response);
    console.log('✅ Categorías del comercio obtenidas:', data);
    
    // Manejar diferentes formatos de respuesta
    if (Array.isArray(data)) {
      return data;
    } else if (data.data && Array.isArray(data.data)) {
      return data.data;
    } else {
      console.warn('⚠️ Formato de respuesta inesperado:', data);
      return [];
    }
    
  } catch (error) {
    console.error('💥 Error en getCategoriasPorComercio:', error);
    
    // Si es un error 404, retornar array vacío
    if (error.message.includes('404') || error.message.includes('Not Found')) {
      console.log('📭 Retornando array vacío por endpoint no encontrado');
      return [];
    }
    
    throw error;
  }
};

// Agregar categoría a comercio - VERSIÓN CORREGIDA
export const agregarCategoriaAComercio = async (comercioId, categoriaId) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log(`➕ Agregando categoría ${categoriaId} al comercio ${comercioId}...`);
    
    // ✅ USAR URL ABSOLUTA
    const url = `${API_CONFIG.BASE_URL}/api/comercios/${comercioId}/categorias/${categoriaId}`;
    console.log('🔗 URL absoluta:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (response.status === 404) {
      throw new Error('Endpoint no encontrado. Verifica que el controlador esté configurado en el backend.');
    }

    const data = await handleResponse(response);
    console.log('✅ Categoría agregada al comercio:', data);
    return data;
    
  } catch (error) {
    console.error('💥 Error en agregarCategoriaAComercio:', error);
    throw error;
  }
};

// Eliminar categoría de comercio - VERSIÓN CORREGIDA
export const eliminarCategoriaDeComercio = async (comercioId, categoriaId) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log(`➖ Eliminando categoría ${categoriaId} del comercio ${comercioId}...`);
    
    // ✅ USAR URL ABSOLUTA
    const url = `${API_CONFIG.BASE_URL}/api/comercios/${comercioId}/categorias/${categoriaId}`;
    console.log('🔗 URL absoluta:', url);
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (response.status === 404) {
      throw new Error('Endpoint no encontrado. Verifica que el controlador esté configurado en el backend.');
    }

    const data = await handleResponse(response);
    console.log('✅ Categoría eliminada del comercio:', data);
    return data;
    
  } catch (error) {
    console.error('💥 Error en eliminarCategoriaDeComercio:', error);
    throw error;
  }
};

// Función de fallback para desarrollo
export const getCategoriasPorComercioFallback = async (comercioId) => {
  console.warn('⚠️ Usando datos de fallback para desarrollo');
  
  // Datos de ejemplo para desarrollo mientras se configura el backend
  const categoriasEjemplo = [
    { id: 1, nombre: 'Hamburguesas', cantidadProductos: 5 },
    { id: 2, nombre: 'Pizzas', cantidadProductos: 8 },
    { id: 3, nombre: 'Bebidas', cantidadProductos: 12 },
    { id: 4, nombre: 'Postres', cantidadProductos: 6 }
  ];
  
  return categoriasEjemplo;
};