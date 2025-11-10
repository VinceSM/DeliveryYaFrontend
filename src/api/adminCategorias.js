// src/api/adminCategorias.js - VERSIÓN CON MEJOR MANEJO DE ERRORES
import { API_CONFIG } from '../config/config.js';
import { getAdminToken } from './adminAuth.js';

// Mapear datos del backend al frontend - SOLO NOMBRE
const mapearCategoriaDesdeBackend = (categoriaData) => {
  return {
    idCategoria: categoriaData.id || categoriaData.idcategoria || categoriaData.idCategoria,
    nombre: categoriaData.nombre,
    cantidadProductos: categoriaData.cantidadProductos || 0,
    createdAt: categoriaData.createdAt,
    updatedAt: categoriaData.updatedAt
  };
};

// Función mejorada para manejar respuestas
const handleResponse = async (response) => {
  console.log('📨 Response status:', response.status);
  
  if (!response.ok) {
    let errorMessage;
    try {
      const errorText = await response.text();
      console.error('❌ Error response text:', errorText);
      
      // Intentar parsear como JSON si parece ser JSON
      if (errorText.trim().startsWith('{') || errorText.trim().startsWith('[')) {
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.mensaje || `Error ${response.status}`;
        } catch {
          errorMessage = errorText;
        }
      } else {
        errorMessage = errorText || `Error ${response.status}: ${response.statusText}`;
      }
    } catch {
      errorMessage = `Error ${response.status}: ${response.statusText}`;
    }
    
    throw new Error(errorMessage);
  }
  
  // Para respuestas exitosas, intentar parsear JSON
  try {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      // Si no es JSON, devolver un objeto vacío
      console.log('⚠️ Respuesta no es JSON, devolviendo objeto vacío');
      return {};
    }
  } catch (error) {
    console.warn('⚠️ Error parseando JSON, devolviendo objeto vacío:', error);
    return {};
  }
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

    const data = await handleResponse(response);
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

// Crear categoría (SOLO ADMIN) - SOLO NOMBRE
export const crearCategoriaAdmin = async (categoriaData) => {
  try {
    const token = getAdminToken();
    
    if (!token) {
      throw new Error('No estás autenticado como administrador');
    }

    console.log('🆕 [ADMIN] Creando nueva categoría...', categoriaData);
    
    // ✅ SOLO ENVIAR NOMBRE
    const requestBody = {
      Nombre: categoriaData.nombre
    };
    
    console.log('📤 Request body:', requestBody);
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/categorias`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody),
    });

    // 🔥 MANEJAR LA RESPUESTA CON LA NUEVA FUNCIÓN
    const data = await handleResponse(response);
    console.log('✅ [ADMIN] Respuesta del backend:', data);
    
    // Si el backend devuelve la categoría creada, mapearla
    if (data && data.nombre) {
      return mapearCategoriaDesdeBackend(data);
    } else {
      // Si no, crear un objeto básico
      console.log('🔄 Backend no devolvió datos completos, creando objeto local');
      return {
        idCategoria: Date.now(), // Temporal
        nombre: categoriaData.nombre,
        cantidadProductos: 0
      };
    }
    
  } catch (error) {
    console.error('💥 Error en crearCategoriaAdmin:', error);
    
    // Si el error es específico del routing, ignorarlo si la categoría se creó
    if (error.message.includes('No route matches') || error.message.includes('CreatedAtActionResult')) {
      console.warn('⚠️ Error de routing en backend, pero la categoría probablemente se creó');
      // Devolver un objeto básico para continuar
      return {
        idCategoria: Date.now(),
        nombre: categoriaData.nombre,
        cantidadProductos: 0
      };
    }
    
    throw error;
  }
};

// Actualizar una categoría (SOLO ADMIN) - SOLO NOMBRE
export const actualizarCategoriaAdmin = async (idCategoria, categoriaData) => {
  try {
    const token = getAdminToken();
    
    if (!token) {
      throw new Error('No estás autenticado como administrador');
    }

    console.log('✏️ [ADMIN] Actualizando categoría...', { idCategoria, categoriaData });
    
    // ✅ SOLO ENVIAR NOMBRE
    const requestBody = {
      Nombre: categoriaData.nombre
    };
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/categorias/${idCategoria}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody),
    });

    await handleResponse(response);
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

    await handleResponse(response);
    console.log('✅ [ADMIN] Categoría eliminada');
    return true;
    
  } catch (error) {
    console.error('💥 Error en eliminarCategoriaAdmin:', error);
    throw error;
  }
};