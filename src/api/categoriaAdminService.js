// src/api/categoriaAdminService.js
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

  // Crear categoría
  create: async (categoriaData) => {
    return await crearCategoriaAdmin(categoriaData);
  },

  // Actualizar categoría
  update: async (idCategoria, categoriaData) => {
    await actualizarCategoriaAdmin(idCategoria, categoriaData);
    // Devolver los datos actualizados
    return { 
      idCategoria: parseInt(idCategoria), 
      ...categoriaData 
    };
  },

  // Eliminar categoría
  delete: async (idCategoria) => {
    await eliminarCategoriaAdmin(idCategoria);
    return true;
  }
};