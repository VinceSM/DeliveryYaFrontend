import { API_CONFIG } from '../config/config.js';

// Función para registrar comercio
export const registerComercio = async (comercioData) => {
  try {
    // DEBUG: Ver qué está llegando
    console.log('📥 Datos recibidos en auth.js:', comercioData);
    
    // El RegisterScreen ya envía los datos con los nombres correctos
    // Solo necesitamos asegurar los tipos
    const requestData = {
      NombreComercio: String(comercioData.NombreComercio || ""),
      Email: String(comercioData.Email || ""),
      Password: String(comercioData.Password || ""),
      FotoPortada: String(comercioData.FotoPortada || ""),
      Celular: String(comercioData.Celular || ""),
      Ciudad: String(comercioData.Ciudad || ""),
      Calle: String(comercioData.Calle || ""),
      Numero: Number(comercioData.Numero) || 0,
      Latitud: Number(comercioData.Latitud) || 0,
      Longitud: Number(comercioData.Longitud) || 0,
      Encargado: String(comercioData.Encargado || ""),
      Cvu: String(comercioData.Cvu || ""),
      Alias: String(comercioData.Alias || ""),
      Destacado: Boolean(comercioData.Destacado)
    };

    console.log('📤 Datos procesados para enviar:', requestData);
    console.log('🔗 URL:', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.COMERCIOS.BASE}`);

    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.COMERCIOS.BASE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    console.log('📥 Status de respuesta:', response.status);
    console.log('📥 OK:', response.ok);

    if (!response.ok) {
      let errorText;
      try {
        errorText = await response.text();
        console.error('❌ Error del servidor (text):', errorText);
        
        // Intentar parsear como JSON para mejor formato
        try {
          const errorJson = JSON.parse(errorText);
          console.error('❌ Error del servidor (JSON):', errorJson);
          errorText = JSON.stringify(errorJson, null, 2);
        } catch {
          // Mantener como texto si no es JSON
        }
      } catch (e) {
        errorText = `Error ${response.status}: ${response.statusText}`;
      }
      
      throw new Error(errorText || `Error ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ Registro exitoso:', result);
    return result;

  } catch (error) {
    console.error('💥 Error en registerComercio:', error);
    
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.');
    }
    
    // Mejorar el mensaje de error para validaciones
    if (error.message.includes('400') || error.message.includes('validation')) {
      try {
        const errorData = JSON.parse(error.message);
        if (errorData.errors) {
          const errorList = Object.entries(errorData.errors)
            .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
            .join('\n');
          throw new Error(`Errores de validación:\n${errorList}`);
        }
      } catch {
        // Si no se puede parsear, mantener el error original
      }
    }
    
    throw new Error(error.message || 'Error de conexión con el servidor');
  }
};

// Función para verificar conexión con el backend
export const checkBackendConnection = async () => {
  try {
    console.log('🔍 Verificando conexión con el backend...');
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/Comercios`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const isConnected = response.ok;
    console.log('🔍 Backend conectado:', isConnected);
    return isConnected;
  } catch (error) {
    console.error('🔍 Backend no disponible:', error);
    return false;
  }
};

// Función para login de comercio
export const loginComercio = async (credentials) => {
  try {
    console.log('🔐 Intentando login...', credentials);
    
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    console.log('📥 Status de respuesta:', response.status);
    
    if (!response.ok) {
      let errorText;
      try {
        errorText = await response.text();
        console.error('❌ Error en login:', errorText);
        
        // Intentar parsear como JSON
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
    console.log('✅ Respuesta del login:', data);
    
    // CORRECCIÓN: El backend envía las propiedades directamente, no dentro de "comercio"
    // Crear estructura que espera el frontend
    const loginResponse = {
      token: data.token,
      comercio: {
        idComercio: data.idComercio,
        NombreComercio: data.NombreComercio,
        Email: data.Email,
        Encargado: data.Encargado,
        Celular: data.Celular,
        Direccion: data.Direccion,
        Latitud: data.Latitud,
        Longitud: data.Longitud,
        CVU: data.CVU,
        Alias: data.Alias,
        Destacado: data.Destacado
      }
    };
    
    // Guardar token en localStorage si existe
    if (loginResponse.token) {
      localStorage.setItem('authToken', loginResponse.token);
      localStorage.setItem('comercioData', JSON.stringify(loginResponse.comercio));
      console.log('🔐 Token y datos guardados en localStorage');
    }
    
    return loginResponse;
  } catch (error) {
    console.error('💥 Error en loginComercio:', error);
    
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.');
    }
    
    throw new Error(error.message || 'Error de conexión con el servidor');
  }
};

// Función para logout
export const logoutComercio = () => {
  try {
    localStorage.removeItem('authToken');
    localStorage.removeItem('comercioData');
    console.log('🔐 Logout exitoso');
    return true;
  } catch (error) {
    console.error('💥 Error en logout:', error);
    return false;
  }
};

// Función para obtener token
export const getToken = () => {
  const token = localStorage.getItem('authToken');
  console.log('🔐 Token obtenido:', !!token);
  return token;
};

// Función para verificar si está autenticado
export const isAuthenticated = () => {
  const token = getToken();
  const isAuth = !!token;
  console.log('🔐 Usuario autenticado:', isAuth);
  return isAuth;
};

// Función para obtener datos del comercio
export const getComercioData = () => {
  try {
    const comercioData = localStorage.getItem('comercioData');
    const data = comercioData ? JSON.parse(comercioData) : null;
    console.log('🔐 Datos del comercio obtenidos:', !!data);
    return data;
  } catch (error) {
    console.error('💥 Error obteniendo datos del comercio:', error);
    return null;
  }
};

// Función para validar token (opcional)
export const validateToken = async () => {
  try {
    const token = getToken();
    if (!token) {
      console.log('🔐 No hay token para validar');
      return false;
    }

    // Aquí puedes hacer una petición para validar el token
    // Por ahora, simplemente retornamos true si existe el token
    console.log('🔐 Token válido (verificación básica)');
    return true;
  } catch (error) {
    console.error('💥 Error validando token:', error);
    return false;
  }
};