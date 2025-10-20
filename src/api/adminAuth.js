import { API_CONFIG } from '../config/config.js';

// Función para login de admin
export const loginAdmin = async (credentials) => {
  try {
    console.log('🔐 Intentando login de admin...', credentials);
    
    // ✅ CORRECCIÓN: Usar el endpoint correcto para login
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMINS.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // ✅ CORRECCIÓN: Enviar los campos que espera el backend
        Usuario: credentials.email,  // El backend espera "Usuario" no "email"
        Password: credentials.password
      }),
    });

    console.log('📥 Status de respuesta admin:', response.status);
    
    if (!response.ok) {
      let errorText;
      try {
        errorText = await response.text();
        console.error('❌ Error en login admin:', errorText);
        
        try {
          const errorJson = JSON.parse(errorText);
          errorText = errorJson.message || JSON.stringify(errorJson);
        } catch {
          // Mantener como texto si no es JSON
        }
      } catch (e) {
        errorText = `Error ${response.status}: ${response.statusText}`;
      }
      
      throw new Error(errorText || 'Credenciales inválidas');
    }

    const data = await response.json();
    console.log('✅ Respuesta del login admin:', data);

    const loginResponse = {
      token: data.token,
      admin: {
        idAdmin: data.idAdmin,
        email: data.email,
        nombre: data.nombre
      }
    };
    
    // Guardar en localStorage con prefijo admin
    if (loginResponse.token) {
      localStorage.setItem('adminAuthToken', loginResponse.token);
      localStorage.setItem('adminData', JSON.stringify(loginResponse.admin));
      console.log('🔐 Token y datos de admin guardados en localStorage');
    }
    
    return loginResponse;
  } catch (error) {
    console.error('💥 Error en loginAdmin:', error);
    
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.');
    }
    
    throw new Error(error.message || 'Error de conexión con el servidor');
  }
};
// Función para logout de admin
export const logoutAdmin = () => {
  try {
    localStorage.removeItem('adminAuthToken');
    localStorage.removeItem('adminData');
    console.log('🔐 Logout de admin exitoso');
    return true;
  } catch (error) {
    console.error('💥 Error en logout admin:', error);
    return false;
  }
};

// Función para obtener token de admin
export const getAdminToken = () => {
  const token = localStorage.getItem('adminAuthToken');
  console.log('🔐 Token de admin obtenido:', !!token);
  return token;
};

// Función para verificar si admin está autenticado
export const isAdminAuthenticated = () => {
  const token = getAdminToken();
  const isAuth = !!token;
  console.log('🔐 Admin autenticado:', isAuth);
  return isAuth;
};

// Función para obtener datos del admin
export const getAdminData = () => {
  try {
    const adminData = localStorage.getItem('adminData');
    const data = adminData ? JSON.parse(adminData) : null;
    console.log('🔐 Datos del admin obtenidos:', !!data);
    return data;
  } catch (error) {
    console.error('💥 Error obteniendo datos del admin:', error);
    return null;
  }
};

// Función para validar token de admin
export const validateAdminToken = async () => {
  try {
    const token = getAdminToken();
    if (!token) {
      console.log('🔐 No hay token de admin para validar');
      return false;
    }

    // Aquí puedes hacer una petición para validar el token
    // Por ahora, simplemente retornamos true si existe el token
    console.log('🔐 Token de admin válido (verificación básica)');
    return true;
  } catch (error) {
    console.error('💥 Error validando token de admin:', error);
    return false;
  }
};