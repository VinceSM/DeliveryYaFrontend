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
    PRODUCTOS: {
      BASE: "/api/CategoriaProducto/{idCategoria}/productos",
      BY_ID: "/api/CategoriaProducto/producto/{id}",
      CREATE: "/api/CategoriaProducto/{idCategoria}/crear",
      UPDATE: "/api/CategoriaProducto/producto/{id}/editar", 
      DELETE: "/api/CategoriaProducto/producto/{id}/eliminar",
      BY_CATEGORIA: "/api/CategoriaProducto/{idCategoria}/productos",
      BY_NOMBRE: "/api/CategoriaProducto/buscar",
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