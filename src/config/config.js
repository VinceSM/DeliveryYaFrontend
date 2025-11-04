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
      CATEGORIAS: "/api/Comercios/{id}/categorias", // ← Para obtener categorías de un comercio
      ADD_CATEGORIA: "/api/Comercios/{id}/categorias/{categoriaId}" // ← Para asociar categorías
    },
    PRODUCTOS: {
      BASE: "/api/Producto/list",
      BY_ID: "/api/Producto/{id}",
      CREATE: "/api/Producto/create",
      UPDATE: "/api/Producto/update/{id}",
      DELETE: "/api/Producto/delete/{id}",
      BY_CATEGORIA: "/api/Producto/byCategoria/{categoriaId}",
      BY_NOMBRE: "/api/Producto/search",
      OFERTA: "/api/Producto/oferta"
    },
    STOCK: {
      BASE: "/api/Stock",
      BY_PRODUCTO: "/api/Stock/producto/{productoId}"
    },
    CATEGORIAS: {
      BASE: "/api/Categoria",
      BY_ID: "/api/Categoria/{id}",
      PRODUCTOS: "/api/Categoria/{id}/productos",
      CREATE: "/api/Categoria",
      UPDATE: "/api/Categoria/{id}",
      DELETE: "/api/Categoria/{id}",
      // NUEVOS ENDPOINTS PARA RELACIÓN COMERCIO-CATEGORÍA
      COMERCIO: {
        BASE: "/api/ComercioCategoria", // ← Endpoint base para relación
        ADD: "/api/ComercioCategoria/comercio/{comercioId}/categoria/{categoriaId}",
        REMOVE: "/api/ComercioCategoria/comercio/{comercioId}/categoria/{categoriaId}",
        BY_COMERCIO: "/api/ComercioCategoria/comercio/{comercioId}" // ← Obtener categorías del comercio
      }
    },
    ADMINS: {
      BASE: "/api/Admins",
      LOGIN: "/api/Auth/login-admin"
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
    HORARIOS: {
      BASE: "/api/Horarios",
      BY_COMERCIO: "/api/Horarios/comercio/{comercioId}",
      ADD_TO_COMERCIO: "/api/Horarios/comercio/{comercioId}/horario/{horarioId}"
    },
  }
};