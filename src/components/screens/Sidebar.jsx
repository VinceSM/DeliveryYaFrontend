import { Home, Package, ShoppingCart, Clock, Settings, LogOut, Store, ChevronRight } from "lucide-react";
import "../../styles/components/Sidebar.css";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  { id: "home", label: "Inicio", icon: <Home size={20} />, path: "/dashboard" },
  { id: "productos", label: "Productos", icon: <Package size={20} />, path: "/productos" },
  { id: "pedidos", label: "Pedidos", icon: <ShoppingCart size={20} />, path: "/pedidos" },
  { id: "horarios", label: "Horarios", icon: <Clock size={20} />, path: "/horarios" },
  { id: "perfil", label: "Perfil", icon: <Settings size={20} />, path: "/perfil" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveItem = () => {
    const currentPath = location.pathname;
    const item = menuItems.find(item => item.path === currentPath);
    return item ? item.id : "home";
  };

  const active = getActiveItem();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    // Aquí iría la lógica de logout
    console.log("Cerrando sesión...");
    navigate("/auth/login");
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
          <h3 className="section-title">Navegación Principal</h3>
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
              <span>MC</span>
            </div>
          </div>
          <div className="user-details">
            <p className="user-name">Administrador</p>
            <p className="user-role">Mi Comercio</p>
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