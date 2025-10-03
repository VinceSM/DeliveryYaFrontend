import { useState, useEffect, createContext, useContext } from 'react';
import { 
  loginComercio as apiLogin, 
  logoutComercio as apiLogout, 
  getComercio, 
  isAuthenticated,
  getToken
} from '../api/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [comercio, setComercio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    // Verificar si hay una sesión activa al cargar la app
    const checkAuth = async () => {
      try {
        if (isAuthenticated()) {
          const comercioData = getComercio();
          // Verificar que el token no sea el simulado o esté expirado
          const token = getToken();
          if (token && token !== "simulated-jwt-token") {
            setComercio(comercioData);
          } else {
            // Token inválido, limpiar
            apiLogout();
          }
        }
      } catch (error) {
        console.error("Error verificando autenticación:", error);
        apiLogout();
      } finally {
        setLoading(false);
        setIsAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiLogin({ email, password });
      
      // Ajusta según la estructura de respuesta de tu backend
      if (response.Token || response.token) {
        const token = response.Token || response.token;
        const comercioData = response.Comercio || response.comercio;
        
        localStorage.setItem("token", token);
        localStorage.setItem("comercio", JSON.stringify(comercioData));
        setComercio(comercioData);
        return { success: true };
      } else {
        throw new Error("No se recibió token del servidor");
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    apiLogout();
    setComercio(null);
  };

  const value = {
    comercio,
    login,
    logout,
    isAuthenticated: !!comercio,
    getToken,
    loading: loading || !isAuthChecked
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}