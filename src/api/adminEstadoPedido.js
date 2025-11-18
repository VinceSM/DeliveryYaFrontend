import { API_CONFIG } from '../config/config.js';

export const adminEstadoPedidoAPI = {
  // Obtener todos los estados de pedido
  getAllEstados: async (page = 1, pageSize = 10, search = '') => {
    try {
      const token = localStorage.getItem('adminAuthToken');
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ESTADOS_PEDIDO.GET_ALL}?page=${page}&pageSize=${pageSize}&search=${search}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener estados de pedido:', error);
      throw error;
    }
  },

  // Obtener estado por ID
  getEstadoById: async (id) => {
    try {
      const token = localStorage.getItem('adminAuthToken');
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ESTADOS_PEDIDO.GET_BY_ID.replace(':id', id)}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener estado de pedido:', error);
      throw error;
    }
  },

  // Crear nuevo estado
  createEstado: async (estadoData) => {
    try {
      const token = localStorage.getItem('adminAuthToken');
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ESTADOS_PEDIDO.CREATE}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(estadoData),
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al crear estado de pedido:', error);
      throw error;
    }
  },

  // Actualizar estado
  updateEstado: async (id, estadoData) => {
    try {
      const token = localStorage.getItem('adminAuthToken');
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ESTADOS_PEDIDO.UPDATE.replace(':id', id)}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(estadoData),
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al actualizar estado de pedido:', error);
      throw error;
    }
  },

  // Eliminar estado
  deleteEstado: async (id) => {
    try {
      const token = localStorage.getItem('adminAuthToken');
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ESTADOS_PEDIDO.DELETE.replace(':id', id)}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al eliminar estado de pedido:', error);
      throw error;
    }
  },
};