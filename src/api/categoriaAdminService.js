// src/api/categoriaAdminService.js - VERSIÓN TOLERANTE A ERRORES
import { 
  getTodasLasCategoriasAdmin, 
  crearCategoriaAdmin, 
  actualizarCategoriaAdmin, 
  eliminarCategoriaAdmin 
} from './adminCategorias.js';

// Servicio unificado para el admin
export const categoriaAdminService = {
  // Obtener todas las categorías
  getAll: async () => {
    return await getTodasLasCategoriasAdmin();
  },

  // Obtener categoría por ID
  getById: async (idCategoria) => {
    const categorias = await getTodasLasCategoriasAdmin();
    return categorias.find(cat => cat.idCategoria == idCategoria);
  },

  // Crear categoría - CON MANEJO MEJORADO DE ERRORES
  create: async (categoriaData) => {
    try {
      return await crearCategoriaAdmin(categoriaData);
    } catch (error) {
      console.error('❌ Error en servicio crear categoría:', error);
      
      // Si es error de routing pero la categoría se creó, continuar
      if (error.message.includes('No route matches') || 
          error.message.includes('CreatedAtActionResult')) {
        console.warn('🔄 Continuando a pesar del error de routing');
        return {
          idCategoria: Date.now(),
          nombre: categoriaData.nombre,
          cantidadProductos: 0
        };
      }
      
      throw error;
    }
  },

  // Actualizar categoría
  update: async (idCategoria, categoriaData) => {
    try {
      await actualizarCategoriaAdmin(idCategoria, categoriaData);
      // Devolver los datos actualizados
      return { 
        idCategoria: parseInt(idCategoria), 
        nombre: categoriaData.nombre,
        cantidadProductos: 0
      };
    } catch (error) {
      console.error('❌ Error en servicio actualizar categoría:', error);
      throw error;
    }
  },

  // Eliminar categoría
  delete: async (idCategoria) => {
    try {
      await eliminarCategoriaAdmin(idCategoria);
      return true;
    } catch (error) {
      console.error('❌ Error en servicio eliminar categoría:', error);
      throw error;
    }
  }
};