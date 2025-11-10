import { Home, Package, ShoppingCart, Clock, Settings, LogOut, Store, ChevronRight, Tag } from "lucide-react";
import "../../styles/components/Sidebar.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const menuItems = [
  { id: "home", label: "Inicio", icon: <Home size={20} />, path: "/dashboard" },
  { id: "productos", label: "Productos", icon: <Package size={20} />, path: "/productos" },
  { id: "categorias", label: "Categorías", icon: <Tag size={20} />, path: "/categorias" },
  { id: "pedidos", label: "Pedidos", icon: <ShoppingCart size={20} />, path: "/pedidos" },
  { id: "horarios", label: "Horarios", icon: <Clock size={20} />, path: "/horarios" },
  { id: "perfil", label: "Perfil", icon: <Settings size={20} />, path: "/perfil" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const getActiveItem = () => {
    const currentPath = location.pathname;
    
    if (currentPath.startsWith('/productos')) {
      return "productos";
    }
    if (currentPath.startsWith('/categorias')) { 
      return "categorias";
    }
    if (currentPath.startsWith('/pedidos')) {
      return "pedidos";
    }
    if (currentPath.startsWith('/horarios')) {
      return "horarios";
    }
    if (currentPath.startsWith('/perfil')) {
      return "perfil";
    }
    
    // Buscar coincidencia exacta
    const item = menuItems.find(item => item.path === currentPath);
    return item ? item.id : "home";
  };

  const active = getActiveItem();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      console.log("🔐 Cerrando sesión...");
      
      // Mostrar confirmación
      const confirmLogout = window.confirm("¿Estás seguro de que quieres cerrar sesión?");
      if (!confirmLogout) return;
      
      // Ejecutar logout
      const success = await logout();
      
      if (success) {
        console.log("✅ Sesión cerrada exitosamente");
        alert("Sesión cerrada exitosamente");
        navigate("/auth/login");
      } else {
        console.error("❌ Error al cerrar sesión");
        alert("Error al cerrar sesión");
      }
    } catch (error) {
      console.error("💥 Error en logout:", error);
      alert("Error al cerrar sesión: " + error.message);
    }
  };

  // Obtener iniciales para el avatar
  const getUserInitials = () => {
    if (user && user.NombreComercio) {
      return user.NombreComercio
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return "MC";
  };

  // Obtener nombre del comercio o usuario
  const getUserName = () => {
    if (user && user.NombreComercio) {
      return user.NombreComercio;
    }
    return "Administrador";
  };

  // Obtener email del usuario
  const getUserEmail = () => {
    if (user && user.Email) {
      return user.Email;
    }
    return "Mi Comercio";
  };

  return (
    <div className="sidebar-container">
      {/* Header con Logo y Nombre */}
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon">
            <Store size={28} />
          </div>
          <div className="logo-text">
            <h1 className="logo-title">Mi Comercio</h1>
            <p className="logo-subtitle">Panel de control</p>
          </div>
        </div>
      </div>

      {/* Navegación Principal */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3 className="sidebar-section-title">Gestión</h3>
          <div className="nav-items">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`nav-item ${active === item.id ? 'nav-item-active' : ''}`}
              >
                <div className="nav-item-content">
                  <div className="nav-icon">
                    {item.icon}
                  </div>
                  <span className="nav-label">{item.label}</span>
                </div>
                <div className="nav-indicator">
                  <ChevronRight size={16} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer del Sidebar */}
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            <div className="avatar-placeholder">
              <span>{getUserInitials()}</span>
            </div>
          </div>
          <div className="user-details">
            <p className="user-name">{getUserName()}</p>
            <p className="user-role">{getUserEmail()}</p>
          </div>
        </div>
        
        <button className="logout-btn" onClick={handleLogout}>
          <div className="logout-icon">
            <LogOut size={18} />
          </div>
          <span className="logout-text">Cerrar sesión</span>
        </button>
      </div>

      {/* Efecto de decoración */}
      <div className="sidebar-decoration">
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
      </div>
    </div>
  );
}