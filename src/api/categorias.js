// src/api/categorias.js
import { API_CONFIG } from '../config/config.js';
import { getToken } from './auth.js';

// Función para mapear datos del backend al frontend
const mapearCategoriaDesdeBackend = (categoriaData) => {
  return {
    idCategoria: categoriaData.id || categoriaData.idcategoria || categoriaData.idCategoria, // ✅ Múltiples opciones
    nombre: categoriaData.nombre,
    cantidadProductos: categoriaData.cantidadProductos || 0,
    createdAt: categoriaData.createdAt,
    updatedAt: categoriaData.updatedAt
  };
};

// Obtener todas las categorías
export const getCategorias = async () => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('📂 Obteniendo categorías desde backend...');
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/Categorias`, {
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
    
    // Mapear los datos al formato del frontend
    const categoriasMapeadas = Array.isArray(data) 
      ? data.map(mapearCategoriaDesdeBackend)
      : [];
    
    return categoriasMapeadas;
    
  } catch (error) {
    console.error('💥 Error en getCategorias:', error);
    throw error;
  }
};

// Crear una nueva categoría
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
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/Categorias`, {
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

// Actualizar una categoría
export const actualizarCategoria = async (idCategoria, categoriaData) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('✏️ Actualizando categoría...', { idCategoria, categoriaData });
    
    const requestBody = {
      Id: idCategoria,
      Nombre: categoriaData.nombre
    };
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/Categorias/${idCategoria}`, {
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

// Eliminar una categoría
export const eliminarCategoria = async (idCategoria) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('🗑️ Eliminando categoría...', { idCategoria });
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/Categorias/${idCategoria}`, {
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

// Obtener productos por categoría
export const getProductosPorCategoria = async (idCategoria) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('📦 Obteniendo productos por categoría...', { idCategoria });
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/Categorias/${idCategoria}/productos`, {
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