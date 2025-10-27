// src/api/categorias.js (VERSIÓN CORREGIDA)
import { API_CONFIG } from '../config/config.js';
import { getToken } from './auth.js';

// Función para construir URLs
const buildUrl = (endpoint, params = {}) => {
  let url = `${API_CONFIG.BASE_URL}${endpoint}`;
  Object.keys(params).forEach(key => {
    url = url.replace(`{${key}}`, encodeURIComponent(params[key]));
  });
  return url;
};

// Mapear datos del backend al frontend
const mapearCategoriaDesdeBackend = (categoriaData) => {
  return {
    idCategoria: categoriaData.id || categoriaData.idcategoria || categoriaData.idCategoria,
    nombre: categoriaData.nombre,
    cantidadProductos: categoriaData.cantidadProductos || 0,
    createdAt: categoriaData.createdAt,
    updatedAt: categoriaData.updatedAt
  };
};

// Obtener todas las categorías (CORREGIDO)
export const getCategorias = async () => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    // ✅ CORREGIDO: Usar /api/Categoria (singular) en lugar de /api/Categorias (plural)
    const url = `${API_CONFIG.BASE_URL}/api/Categoria`;
    console.log('📂 Obteniendo categorías desde:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    console.log('📥 Status de respuesta categorías:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error obteniendo categorías:', errorText);
      throw new Error(errorText || 'Error al obtener categorías');
    }

    const data = await response.json();
    console.log('✅ Categorías obtenidas del backend:', data);
    
    const categoriasMapeadas = Array.isArray(data) 
      ? data.map(mapearCategoriaDesdeBackend)
      : [];
    
    return categoriasMapeadas;
    
  } catch (error) {
    console.error('💥 Error en getCategorias:', error);
    throw error;
  }
};

// Crear una nueva categoría (CORREGIDO)
export const crearCategoria = async (categoriaData) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('🆕 Creando nueva categoría...', categoriaData);
    
    const requestBody = {
      Nombre: categoriaData.nombre
    };
    
    // ✅ CORREGIDO: Usar /api/Categoria (singular)
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/Categoria`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📥 Status de respuesta crear categoría:', response.status);
    
    if (!response.ok) {
      let errorText;
      try {
        errorText = await response.text();
        console.error('❌ Error creando categoría:', errorText);
      } catch (e) {
        errorText = `Error ${response.status}: ${response.statusText}`;
      }
      
      throw new Error(errorText || 'Error al crear categoría');
    }

    const data = await response.json();
    console.log('✅ Categoría creada:', data);
    
    return mapearCategoriaDesdeBackend(data);
    
  } catch (error) {
    console.error('💥 Error en crearCategoria:', error);
    throw error;
  }
};

// Actualizar una categoría (CORREGIDO)
export const actualizarCategoria = async (idCategoria, categoriaData) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('✏️ Actualizando categoría...', { idCategoria, categoriaData });
    
    const requestBody = {
      Nombre: categoriaData.nombre
    };
    
    // ✅ CORREGIDO: Usar /api/Categoria/{id} (singular)
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/Categoria/${idCategoria}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📥 Status de respuesta actualizar categoría:', response.status);
    
    if (!response.ok) {
      let errorText;
      try {
        errorText = await response.text();
        console.error('❌ Error actualizando categoría:', errorText);
      } catch (e) {
        errorText = `Error ${response.status}: ${response.statusText}`;
      }
      
      throw new Error(errorText || 'Error al actualizar categoría');
    }

    console.log('✅ Categoría actualizada');
    return true;
    
  } catch (error) {
    console.error('💥 Error en actualizarCategoria:', error);
    throw error;
  }
};

// Eliminar una categoría (CORREGIDO)
export const eliminarCategoria = async (idCategoria) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('🗑️ Eliminando categoría...', { idCategoria });
    
    // ✅ CORREGIDO: Usar /api/Categoria/{id} (singular)
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/Categoria/${idCategoria}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    console.log('📥 Status de respuesta eliminar categoría:', response.status);
    
    if (!response.ok) {
      let errorText;
      try {
        errorText = await response.text();
        console.error('❌ Error eliminando categoría:', errorText);
      } catch (e) {
        errorText = `Error ${response.status}: ${response.statusText}`;
      }
      
      throw new Error(errorText || 'Error al eliminar categoría');
    }

    console.log('✅ Categoría eliminada');
    return true;
    
  } catch (error) {
    console.error('💥 Error en eliminarCategoria:', error);
    throw error;
  }
};

// Obtener productos por categoría (CORREGIDO)
export const getProductosPorCategoria = async (idCategoria) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('📦 Obteniendo productos por categoría...', { idCategoria });
    
    // ✅ CORREGIDO: Usar /api/Categoria/{id}/productos (singular)
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/Categoria/${idCategoria}/productos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    console.log('📥 Status de respuesta productos por categoría:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error obteniendo productos por categoría:', errorText);
      throw new Error(errorText || 'Error al obtener productos por categoría');
    }

    const data = await response.json();
    console.log('✅ Productos por categoría obtenidos:', data);
    
    return Array.isArray(data) ? data : [];
    
  } catch (error) {
    console.error('💥 Error en getProductosPorCategoria:', error);
    throw error;
  }
};