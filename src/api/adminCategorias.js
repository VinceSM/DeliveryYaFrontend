// src/api/adminCategorias.js
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

// Mapear datos del backend al frontend
const mapearCategoriaDesdeBackend = (categoriaData) => {
  return {
    idCategoria: categoriaData.id || categoriaData.idcategoria || categoriaData.idCategoria,
    nombre: categoriaData.nombre,
    descripcion: categoriaData.descripcion || '',
    icono: categoriaData.icono || '📁',
    estado: categoriaData.estado || 'activo',
    cantidadProductos: categoriaData.cantidadProductos || 0,
    createdAt: categoriaData.createdAt,
    updatedAt: categoriaData.updatedAt
  };
};

// Obtener TODAS las categorías del sistema (SOLO ADMIN)
export const getTodasLasCategoriasAdmin = async () => {
  try {
    const token = getAdminToken();
    
    if (!token) {
      console.error('❌ No hay token de administrador disponible');
      throw new Error('No estás autenticado como administrador');
    }

    console.log('📂 [ADMIN] Obteniendo TODAS las categorías del sistema...');
    
    const url = `${API_CONFIG.BASE_URL}/api/admin/categorias`;
    console.log('🔗 URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    console.log('📥 Status de respuesta todas las categorías:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error obteniendo todas las categorías:', errorText);
      
      if (response.status === 401) {
        throw new Error('No autorizado - Token de administrador inválido');
      }
      
      throw new Error(errorText || 'Error al obtener todas las categorías');
    }

    const data = await response.json();
    console.log('✅ [ADMIN] Todas las categorías obtenidas:', data);
    
    const categoriasMapeadas = Array.isArray(data) 
      ? data.map(mapearCategoriaDesdeBackend)
      : [];
    
    return categoriasMapeadas;
    
  } catch (error) {
    console.error('💥 Error en getTodasLasCategoriasAdmin:', error);
    throw error;
  }
};

// Crear categoría (SOLO ADMIN)
export const crearCategoriaAdmin = async (categoriaData) => {
  try {
    const token = getAdminToken();
    
    if (!token) {
      throw new Error('No estás autenticado como administrador');
    }

    console.log('🆕 [ADMIN] Creando nueva categoría...', categoriaData);
    
    const requestBody = {
      Nombre: categoriaData.nombre,
      Descripcion: categoriaData.descripcion || '',
      Icono: categoriaData.icono || '📁'
    };
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/categorias`, {
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
    console.log('✅ [ADMIN] Categoría creada:', data);
    
    return mapearCategoriaDesdeBackend(data);
    
  } catch (error) {
    console.error('💥 Error en crearCategoriaAdmin:', error);
    throw error;
  }
};

// Actualizar una categoría (SOLO ADMIN)
export const actualizarCategoriaAdmin = async (idCategoria, categoriaData) => {
  try {
    const token = getAdminToken();
    
    if (!token) {
      throw new Error('No estás autenticado como administrador');
    }

    console.log('✏️ [ADMIN] Actualizando categoría...', { idCategoria, categoriaData });
    
    const requestBody = {
      Nombre: categoriaData.nombre,
      Descripcion: categoriaData.descripcion || '',
      Icono: categoriaData.icono || '📁'
    };
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/categorias/${idCategoria}`, {
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

    console.log('✅ [ADMIN] Categoría actualizada');
    return true;
    
  } catch (error) {
    console.error('💥 Error en actualizarCategoriaAdmin:', error);
    throw error;
  }
};

// Eliminar una categoría (SOLO ADMIN)
export const eliminarCategoriaAdmin = async (idCategoria) => {
  try {
    const token = getAdminToken();
    
    if (!token) {
      throw new Error('No estás autenticado como administrador');
    }

    console.log('🗑️ [ADMIN] Eliminando categoría...', { idCategoria });
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/categorias/${idCategoria}`, {
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

    console.log('✅ [ADMIN] Categoría eliminada');
    return true;
    
  } catch (error) {
    console.error('💥 Error en eliminarCategoriaAdmin:', error);
    throw error;
  }
};