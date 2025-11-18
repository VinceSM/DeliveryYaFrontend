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
      BY_ID: "/api/categorias/productos/{idProducto}", 
      CREATE: "/api/categorias/{idCategoria}/productos",
      UPDATE: "/api/categorias/productos/{idProducto}",
      DELETE: "/api/categorias/productos/{idProducto}",
      SEARCH: "/api/categorias/productos/buscar", 
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
      BY_COMERCIO: "/api/ComercioHorarios/{comercioId}/horarios",
      CREATE: "/api/ComercioHorarios/{comercioId}/horarios/crear",
      UPDATE: "/api/ComercioHorarios/{comercioId}/horarios/{horarioId}/editar",
      DELETE: "/api/ComercioHorarios/{comercioId}/horarios/{horarioId}/eliminar",
      BASE: "/api/Horarios",
      ADD_TO_COMERCIO: "/api/ComercioHorarios/{comercioId}/add/{horarioId}",
      REMOVE_FROM_COMERCIO: "/api/ComercioHorarios/{comercioId}/remove/{horarioId}",
      CHECK_ABIERTO: "/api/ComercioHorarios/{comercioId}/abierto"
    },
    COMERCIO_CATEGORIAS: {
      BY_COMERCIO: "/api/comercios/{comercioId}/categorias",
      ADD: "/api/comercios/{comercioId}/categorias/{categoriaId}",
      REMOVE: "/api/comercios/{comercioId}/categorias/{categoriaId}",
      BY_CATEGORIA: "/api/categorias/{categoriaId}/comercios"
    },
    ESTADOS_PEDIDO: {
      GET_ALL: '/api/estados-pedido',
      GET_BY_ID: '/api/estados-pedido/:id',
      CREATE: '/api/estados-pedido',
      UPDATE: '/api/estados-pedido/:id',
      DELETE: '/api/estados-pedido/:id',
      GET_BY_TIPO: '/api/estados-pedido/tipo/:tipo'
    },
    METODOS_PAGO: {
      GET_ALL: '/api/metodos-pago-pedido',
      GET_BY_ID: '/api/metodos-pago-pedido/:id',
      CREATE: '/api/metodos-pago-pedido',
      UPDATE: '/api/metodos-pago-pedido/:id',
      DELETE: '/api/metodos-pago-pedido/:id',
      GET_BY_METODO: '/api/metodos-pago-pedido/metodo/:metodo'
    }
  }
};