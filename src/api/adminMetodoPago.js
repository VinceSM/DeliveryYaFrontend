import { API_CONFIG } from '../config/config.js';

export const adminMetodoPagoAPI = {
  // Obtener todos los métodos de pago
  getAllMetodos: async (page = 1, pageSize = 10, search = '') => {
    try {
      const token = localStorage.getItem('adminAuthToken');
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.METODOS_PAGO.GET_ALL}?page=${page}&pageSize=${pageSize}&search=${search}`,
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
      console.error('Error al obtener métodos de pago:', error);
      throw error;
    }
  },

  // Obtener método por ID
  getMetodoById: async (id) => {
    try {
      const token = localStorage.getItem('adminAuthToken');
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.METODOS_PAGO.GET_BY_ID.replace(':id', id)}`,
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
      console.error('Error al obtener método de pago:', error);
      throw error;
    }
  },

  // Crear nuevo método
  createMetodo: async (metodoData) => {
    try {
      const token = localStorage.getItem('adminAuthToken');
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.METODOS_PAGO.CREATE}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(metodoData),
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al crear método de pago:', error);
      throw error;
    }
  },

  // Actualizar método
  updateMetodo: async (id, metodoData) => {
    try {
      const token = localStorage.getItem('adminAuthToken');
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.METODOS_PAGO.UPDATE.replace(':id', id)}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(metodoData),
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al actualizar método de pago:', error);
      throw error;
    }
  },

  // Eliminar método
  deleteMetodo: async (id) => {
    try {
      const token = localStorage.getItem('adminAuthToken');
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.METODOS_PAGO.DELETE.replace(':id', id)}`,
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
      console.error('Error al eliminar método de pago:', error);
      throw error;
    }
  },
};