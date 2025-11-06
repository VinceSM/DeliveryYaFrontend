// src/api/categorias.js (VERSIÓN CON TODAS LAS CATEGORÍAS)
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

// Obtener TODAS las categorías del sistema
export const getTodasLasCategorias = async () => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('📂 Obteniendo TODAS las categorías del sistema...');
    
    // ✅ USAR ENDPOINT DEL ADMIN: /api/admin/categorias
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
      throw new Error(errorText || 'Error al obtener todas las categorías');
    }

    const data = await response.json();
    console.log('✅ Todas las categorías obtenidas:', data);
    
    const categoriasMapeadas = Array.isArray(data) 
      ? data.map(mapearCategoriaDesdeBackend)
      : [];
    
    return categoriasMapeadas;
    
  } catch (error) {
    console.error('💥 Error en getTodasLasCategorias:', error);
    throw error;
  }
};

// Obtener categorías del comercio (mantener para otras pantallas)
export const getCategorias = async () => {
  try {
    // Primero intentar obtener todas las categorías
    return await getTodasLasCategorias();
  } catch (error) {
    console.error('💥 Error obteniendo categorías, usando fallback:', error);
    
    // Fallback a categorías por defecto
    const categoriasPorDefecto = [
      { idCategoria: 1, nombre: 'Hamburguesas', cantidadProductos: 0 },
      { idCategoria: 2, nombre: 'Pizzas', cantidadProductos: 0 },
      { idCategoria: 3, nombre: 'Ensaladas', cantidadProductos: 0 },
      { idCategoria: 4, nombre: 'Sushi', cantidadProductos: 0 },
      { idCategoria: 5, nombre: 'Bebidas', cantidadProductos: 0 },
      { idCategoria: 6, nombre: 'Mexicana', cantidadProductos: 0 },
      { idCategoria: 7, nombre: 'Postres', cantidadProductos: 0 },
      { idCategoria: 8, nombre: 'Aperitivos', cantidadProductos: 0 },
      { idCategoria: 9, nombre: 'Sandwiches', cantidadProductos: 0 },
      { idCategoria: 10, nombre: 'Pastas', cantidadProductos: 0 }
    ];
    
    return categoriasPorDefecto;
  }
};

// Las demás funciones se mantienen igual...
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
    
    // ✅ USAR ENDPOINT DEL ADMIN: /api/admin/categorias
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
    
    // ✅ USAR ENDPOINT DEL ADMIN: /api/admin/categorias/{id}
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
    
    // ✅ USAR ENDPOINT DEL ADMIN: /api/admin/categorias/{id}
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
    
    // ✅ USAR ENDPOINT DEL ADMIN: /api/admin/categorias/{id}/productos
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/categorias/${idCategoria}/productos`, {
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

// Obtener categorías con productos del comercio
export const getCategoriasConProductos = async () => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('📂 Obteniendo categorías con productos del comercio...');
    
    // Primero obtener todas las categorías
    const todasLasCategorias = await getTodasLasCategorias();
    console.log('📦 Todas las categorías:', todasLasCategorias);
    
    // Luego obtener productos por cada categoría para contar
    const categoriasConConteo = await Promise.all(
      todasLasCategorias.map(async (categoria) => {
        try {
          const productos = await getProductosPorCategoria(categoria.idCategoria);
          return {
            ...categoria,
            cantidadProductos: productos.length,
            productos: productos // Opcional: guardar los productos si los necesitas
          };
        } catch (error) {
          console.warn(`⚠️ Error obteniendo productos para categoría ${categoria.nombre}:`, error.message);
          return {
            ...categoria,
            cantidadProductos: 0,
            productos: []
          };
        }
      })
    );
    
    console.log('✅ Categorías con conteo de productos:', categoriasConConteo);
    return categoriasConConteo;
    
  } catch (error) {
    console.error('💥 Error en getCategoriasConProductos:', error);
    throw error;
  }
};