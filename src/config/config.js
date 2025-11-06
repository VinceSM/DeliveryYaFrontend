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
      CATEGORIAS: "/api/Comercios/{id}/categorias",
      ADD_CATEGORIA: "/api/Comercios/{id}/categorias/{categoriaId}"
    },
    ADMIN_COMERCIOS: {
      BASE: "/api/admin/comercios",
      PENDIENTES: "/api/admin/comercios/pendientes",
      ACTIVOS: "/api/admin/comercios/activos",
      APROBAR: "/api/admin/comercios/{id}/aprobar",
      DESTACAR: "/api/admin/comercios/{id}/destacar",
      DETALLE: "/api/admin/comercios/{id}/detalle"
    },
    PRODUCTOS: {
      BASE: "/api/categorias/{idCategoria}/productos",
      BY_ID: "/api/categorias/products/{idProducto}",
      CREATE: "/api/categorias/{idCategoria}/productos",
      UPDATE: "/api/categorias/products/{idProducto}",
      DELETE: "/api/categorias/products/{idProducto}",
      SEARCH: "/api/categorias/products/buscar",
      BY_CATEGORIA: "/api/categorias/{idCategoria}/productos"
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
      COMERCIO: {
        BASE: "/api/ComercioCategoria",
        ADD: "/api/ComercioCategoria/comercio/{comercioId}/categoria/{categoriaId}",
        REMOVE: "/api/ComercioCategoria/comercio/{comercioId}/categoria/{categoriaId}",
        BY_COMERCIO: "/api/ComercioCategoria/comercio/{comercioId}"
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
      BY_COMERCIO: "/api/ComercioHorarios/{comercioId}/list", 
      CREATE: "/api/Horarios",
      UPDATE: "/api/ComercioHorarios/{comercioId}/update/{horarioId}",
      DELETE: "/api/Horarios/{id}",
      ADD_TO_COMERCIO: "/api/ComercioHorarios/{comercioId}/add/{horarioId}",
      REMOVE_FROM_COMERCIO: "/api/ComercioHorarios/{comercioId}/remove/{horarioId}",
      CHECK_ABIERTO: "/api/ComercioHorarios/{comercioId}/abierto"
    },
  }
};