import { useState, useEffect, createContext, useContext } from 'react';
import { 
  loginAdmin, 
  logoutAdmin, 
  getAdminToken, 
  isAdminAuthenticated, 
  getAdminData,
  validateAdminToken 
} from '../api/adminAuth';

// Crear contexto de autenticación para admin
const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth debe ser usado dentro de un AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar autenticación al cargar
  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      setLoading(true);
      const authenticated = await validateAdminToken();
      
      if (authenticated) {
        const adminData = getAdminData();
        setAdmin(adminData);
        console.log('✅ Admin autenticado:', adminData);
      } else {
        setAdmin(null);
        console.log('🔐 No hay admin autenticado');
      }
    } catch (error) {
      console.error('Error verificando autenticación de admin:', error);
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await loginAdmin(credentials);
      setAdmin(response.admin);
      
      console.log('✅ Login de admin exitoso:', response.admin);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      logoutAdmin();
      setAdmin(null);
      setError(null);
      console.log('🔐 Logout de admin exitoso');
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    admin,
    loading,
    error,
    login,
    logout,
    isAdminAuthenticated: !!admin,
    clearError
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export default useAdminAuth;