export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:5189",
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/api/Auth/login",
      REGISTER: "/api/Comercios"
    },
    COMERCIOS: {
      BASE: "/api/Comercios",
      DESTACADOS: "/api/Comercios/destacados",
      BY_CIUDAD: "/api/Comercios/ciudad",
      PRODUCTOS: "/api/Comercios/{id}/productos",
      CATEGORIAS: "/api/Comercios/{id}/categorias"
    },
    ADMINS: {
      BASE: "/api/Admins"
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