import { useState, useEffect, createContext, useContext } from 'react';
import { 
  loginComercio, 
  logoutComercio, 
  getToken, 
  isAuthenticated, 
  getComercioData,
  validateToken 
} from '../api/auth';

// Crear contexto de autenticación
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar autenticación al cargar
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const authenticated = isAuthenticated();
      
      if (authenticated) {
        const comercioData = getComercioData();
        setUser(comercioData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await loginComercio(credentials);
      setUser(result.comercio || result);
      
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      logoutComercio();
      setUser(null);
      setError(null);
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default useAuth;