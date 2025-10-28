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
    CATEGORIAS: { // ✅ CORREGIDO: Coincide con backend
      BASE: "/api/Categoria", // ← CAMBIADO: Singular
      BY_ID: "/api/Categoria/{id}", // ← CAMBIADO: Singular
      PRODUCTOS: "/api/Categoria/{id}/productos", // ← CAMBIADO: Singular
      CREATE: "/api/Categoria", // ← NUEVO
      UPDATE: "/api/Categoria/{id}", // ← NUEVO
      DELETE: "/api/Categoria/{id}" // ← NUEVO
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
      CHECK_ABIERTO: "/api/Horarios/comercio/{comercioId}/abierto",
      ADD_TO_COMERCIO: "/api/Horarios/comercio/{comercioId}/horario/{horarioId}"
    },
  }
};