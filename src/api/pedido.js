// src/api/pedido.js
import { API_CONFIG } from '../config/config';

export const pedidoAPI = {
  // Obtener todos los pedidos
  getAll: async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PEDIDOS.BASE}`);
      if (!response.ok) throw new Error('Error al obtener pedidos');
      return await response.json();
    } catch (error) {
      console.error('Error en pedidoAPI.getAll:', error);
      throw error;
    }
  },

  // Obtener pedido por ID
  getById: async (id) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PEDIDOS.BASE}/${id}`);
      if (!response.ok) throw new Error('Error al obtener el pedido');
      return await response.json();
    } catch (error) {
      console.error('Error en pedidoAPI.getById:', error);
      throw error;
    }
  },

  // Obtener pedidos por cliente
  getByCliente: async (clienteId) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PEDIDOS.BASE}/cliente/${clienteId}`);
      if (!response.ok) throw new Error('Error al obtener pedidos del cliente');
      return await response.json();
    } catch (error) {
      console.error('Error en pedidoAPI.getByCliente:', error);
      throw error;
    }
  },

  // Obtener pedidos por repartidor
  getByRepartidor: async (repartidorId) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PEDIDOS.BASE}/repartidor/${repartidorId}`);
      if (!response.ok) throw new Error('Error al obtener pedidos del repartidor');
      return await response.json();
    } catch (error) {
      console.error('Error en pedidoAPI.getByRepartidor:', error);
      throw error;
    }
  },

  // Obtener pedidos por estado
  getByEstado: async (estado) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PEDIDOS.BASE}/estado/${estado}`);
      if (!response.ok) throw new Error('Error al obtener pedidos por estado');
      return await response.json();
    } catch (error) {
      console.error('Error en pedidoAPI.getByEstado:', error);
      throw error;
    }
  },

  // Crear nuevo pedido
  create: async (pedidoData) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PEDIDOS.BASE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedidoData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al crear pedido: ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en pedidoAPI.create:', error);
      throw error;
    }
  },

  // Actualizar estado del pedido
  updateEstado: async (id, estado) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PEDIDOS.BASE}/${id}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(estado)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al actualizar estado: ${errorText}`);
      }
      
      return await response.text(); // Tu backend devuelve string en éxito
    } catch (error) {
      console.error('Error en pedidoAPI.updateEstado:', error);
      throw error;
    }
  },

  // Actualizar estado de pago
  updatePago: async (id, pagado) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PEDIDOS.BASE}/${id}/pago`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pagado)
      });
      
      if (!response.ok) throw new Error('Error al actualizar pago del pedido');
      return await response.text();
    } catch (error) {
      console.error('Error en pedidoAPI.updatePago:', error);
      throw error;
    }
  },

  // Obtener total del pedido
  getTotal: async (id) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PEDIDOS.BASE}/${id}/total`);
      if (!response.ok) throw new Error('Error al obtener total del pedido');
      const result = await response.json();
      return result.Total;
    } catch (error) {
      console.error('Error en pedidoAPI.getTotal:', error);
      throw error;
    }
  },

  // Eliminar pedido
  delete: async (id) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PEDIDOS.BASE}/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al eliminar pedido: ${errorText}`);
      }
      
      return await response.text();
    } catch (error) {
      console.error('Error en pedidoAPI.delete:', error);
      throw error;
    }
  },

  // Método específico para comercios (puedes ajustar según tu lógica de negocio)
  getByComercio: async (comercioId) => {
    try {
      // Como tu backend no tiene endpoint específico para comercios,
      // obtenemos todos y filtramos por los items que pertenecen al comercio
      const todosPedidos = await pedidoAPI.getAll();
      
      // Filtramos pedidos que tengan items de este comercio
      const pedidosDelComercio = todosPedidos.filter(pedido => 
        pedido.ItemsPedido?.some(item => item.ComercioIdComercio === comercioId)
      );
      
      return pedidosDelComercio;
    } catch (error) {
      console.error('Error en pedidoAPI.getByComercio:', error);
      throw error;
    }
  },

  // Obtener pedidos de hoy
  getHoy: async () => {
    try {
      const todosPedidos = await pedidoAPI.getAll();
      const hoy = new Date().toDateString();
      const pedidosHoy = todosPedidos.filter(pedido => 
        new Date(pedido.fecha).toDateString() === hoy
      );
      return pedidosHoy;
    } catch (error) {
      console.error('Error en pedidoAPI.getHoy:', error);
      throw error;
    }
  }
};