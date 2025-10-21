import { API_CONFIG } from '../config/config.js';
import { getToken } from './auth';

// Función para obtener estadísticas del dashboard
export const getEstadisticasDashboard = async () => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('📊 Obteniendo estadísticas del dashboard...');
    
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DASHBOARD.ESTADISTICAS}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    console.log('📥 Status de respuesta dashboard:', response.status);
    
    if (!response.ok) {
      // Si el endpoint no existe, usar datos de prueba temporalmente
      if (response.status === 404) {
        console.log('⚠️ Endpoint de dashboard no disponible, usando datos de prueba');
        return getDatosPrueba();
      }
      
      let errorText;
      try {
        errorText = await response.text();
        console.error('❌ Error obteniendo estadísticas:', errorText);
      } catch (e) {
        errorText = `Error ${response.status}: ${response.statusText}`;
      }
      
      throw new Error(errorText || 'Error al obtener estadísticas');
    }

    const data = await response.json();
    console.log('✅ Estadísticas obtenidas:', data);
    return data;
    
  } catch (error) {
    console.error('💥 Error en getEstadisticasDashboard:', error);
    
    // Si hay error de conexión, retornar datos de prueba
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      console.log('⚠️ Backend no disponible, usando datos de prueba');
      return getDatosPrueba();
    }
    
    throw new Error(error.message || 'Error de conexión con el servidor');
  }
};

// Función para obtener pedidos de hoy
export const getPedidosHoy = async () => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('📦 Obteniendo pedidos de hoy...');
    
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PEDIDOS.HOY}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      // Si el endpoint no existe, usar datos de prueba
      if (response.status === 404) {
        console.log('⚠️ Endpoint de pedidos no disponible, usando datos de prueba');
        return { pedidos: [], total: 0, pendientes: 0 };
      }
      
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Pedidos de hoy obtenidos:', data);
    return data;
    
  } catch (error) {
    console.error('💥 Error en getPedidosHoy:', error);
    // Retornar datos vacíos en caso de error
    return { pedidos: [], total: 0, pendientes: 0 };
  }
};

// Función para obtener productos del comercio
export const getProductosComercio = async () => {
  try {
    const token = getToken();
    const comercioData = JSON.parse(localStorage.getItem('comercioData'));
    
    if (!token || !comercioData) {
      throw new Error('No hay datos de autenticación');
    }

    console.log('📦 Obteniendo productos del comercio...');
    
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.COMERCIOS.PRODUCTOS.replace('{id}', comercioData.idComercio)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      // Si el endpoint no existe, usar datos de prueba
      if (response.status === 404) {
        console.log('⚠️ Endpoint de productos no disponible, usando datos de prueba');
        return { productos: [], total: 0, bajosStock: 0 };
      }
      
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Productos obtenidos:', data);
    return data;
    
  } catch (error) {
    console.error('💥 Error en getProductosComercio:', error);
    // Retornar datos vacíos en caso de error
    return { productos: [], total: 0, bajosStock: 0 };
  }
};

// Datos de prueba temporal (eliminar cuando el backend esté listo)
const getDatosPrueba = () => {
  return {
    ventasHoy: 1240,
    crecimientoVentas: 12,
    pedidosActivos: 8,
    pedidosPendientes: 3,
    totalProductos: 42,
    productosBajosStock: 5,
    clientesNuevos: 14,
    crecimientoClientes: 8,
    actividadReciente: [
      { id: 1, tipo: 'pedido', descripcion: 'Nuevo pedido #00123', fecha: '2024-01-15 14:30' },
      { id: 2, tipo: 'producto', descripcion: 'Producto agotado: Pizza Margarita', fecha: '2024-01-15 13:15' },
      { id: 3, tipo: 'cliente', descripcion: 'Cliente nuevo registrado', fecha: '2024-01-15 12:45' }
    ]
  };
};