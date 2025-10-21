// src/config/config.js
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:5189",
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/api/Auth/login-comercio",
      LOGIN_ADMIN: "/api/Auth/login-admin",
      REGISTER: "/api/Comercios"
    },
    COMERCIOS: {
      BASE: "/api/Comercios",
      DESTACADOS: "/api/Comercios/destacados",
      BY_CIUDAD: "/api/Comercios/ciudad",
      PRODUCTOS: "/api/Comercios/{id}/productos",
      CATEGORIAS: "/api/Comercios/{id}/categorias"
    },
    PRODUCTOS: {
      BASE: "/api/Productos",
      BY_ID: "/api/Productos/{id}",
      BY_CATEGORIA: "/api/Productos/categoria/{categoriaId}",
      BY_NOMBRE: "/api/Productos/nombre/{nombre}",
      OFERTA: "/api/Productos/oferta",
      STOCK: "/api/Productos/{id}/stock"
    },
    STOCK: {
      BASE: "/api/Stock",
      BY_PRODUCTO: "/api/Stock/producto/{productoId}"
    },
    CATEGORIAS: { // ✅ NUEVO: Endpoints de categorías
      BASE: "/api/Categorias",
      BY_ID: "/api/Categorias/{id}",
      PRODUCTOS: "/api/Categorias/{id}/productos",
      COMERCIOS: "/api/Categorias/{id}/comercios"
    },
    ADMINS: {
      BASE: "/api/Admins",
      LOGIN: "/api/Auth/login-admin" // ✅ CORREGIDO: Quité el doble /api
    },
    DASHBOARD: {
      ESTADISTICAS: "/api/Dashboard/estadisticas",
      PEDIDOS_RECIENTES: "/api/Dashboard/pedidos-recientes"
    },
    PEDIDOS: {
      BASE: "/api/Pedidos",
      POR_COMERCIO: "/api/Pedidos/comercio",
      HOY: "/api/Pedidos/hoy"
    },
    HORARIOS: "/api/Horarios"
  }
};

// Función para verificar conexión con el backend
export const checkBackendConnection = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/Comercios`, {
      method: 'GET',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error('Backend no disponible:', error);
    return false;
  }
};