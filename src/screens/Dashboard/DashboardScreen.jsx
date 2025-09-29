import { useState } from "react";
import "../../styles/screens/DashboardScreen.css";
import Sidebar from "../../components/screens/Sidebar";
import { TrendingUp, Users, Package, ShoppingCart} from "lucide-react";

export default function DashboardScreen() {
  const [active, setActive] = useState("home");

  const renderContent = () => {
    const content = {
      home: (
        <div className="fade-in">
          <div className="content-header">
            <h1 className="content-title">Bienvenido a Mi Comercio</h1>
            <p className="content-subtitle">Resumen general de tu negocio</p>
          </div>
          
          <div className="stats-grid">
            <div className="stat-card stat-primary">
              <div className="stat-label">Ventas Hoy</div>
              <div className="stat-value">$1,240</div>
              <div className="stat-trend trend-positive">
                <TrendingUp size={16} />
                <span style={{marginLeft: '4px'}}>+12% vs ayer</span>
              </div>
            </div>
            
            <div className="stat-card stat-secondary">
              <div className="stat-label">Pedidos Activos</div>
              <div className="stat-value">8</div>
              <div className="stat-trend trend-warning">
                <Users size={16} />
                <span style={{marginLeft: '4px'}}>3 pendientes</span>
              </div>
            </div>
            
            <div className="stat-card stat-primary">
              <div className="stat-label">Productos</div>
              <div className="stat-value">42</div>
              <div className="stat-trend trend-warning">
                <Package size={16} />
                <span style={{marginLeft: '4px'}}>5 bajos en stock</span>
              </div>
            </div>
            
            <div className="stat-card stat-secondary">
              <div className="stat-label">Clientes Nuevos</div>
              <div className="stat-value">14</div>
              <div className="stat-trend trend-positive">
                <TrendingUp size={16} />
                <span style={{marginLeft: '4px'}}>+8% este mes</span>
              </div>
            </div>
          </div>
          
          <div className="content-card" style={{marginTop: '2rem'}}>
            <h2 style={{color: '#333333', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: '600'}}>Actividad Reciente</h2>
            <p style={{color: '#6c757d'}}>Aquí iría el contenido de actividad reciente de tu comercio...</p>
          </div>
        </div>
      ),
      productos: (
        <div className="content-card fade-in">
          <h2 style={{color: '#333333', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: '600'}}>Gestión de Productos</h2>
          <p style={{color: '#6c757d'}}>Contenido de gestión de productos...</p>
          <button className="btn-primary" style={{marginTop: '1rem'}}>
            <Package size={18} style={{marginRight: '8px'}} />
            Agregar Producto
          </button>
        </div>
      ),
      pedidos: (
        <div className="content-card fade-in">
          <h2 style={{color: '#333333', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: '600'}}>Pedidos en Curso</h2>
          <p style={{color: '#6c757d'}}>Contenido de pedidos en curso...</p>
          <button className="btn-primary" style={{marginTop: '1rem'}}>
            <ShoppingCart size={18} style={{marginRight: '8px'}} />
            Ver Todos los Pedidos
          </button>
        </div>
      ),
      horarios: (
        <div className="content-card fade-in">
          <h2 style={{color: '#333333', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: '600'}}>Configuración de Horarios</h2>
          <p style={{color: '#6c757d'}}>Contenido de configuración de horarios...</p>
        </div>
      ),
      perfil: (
        <div className="content-card fade-in">
          <h2 style={{color: '#333333', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: '600'}}>Perfil del Comercio</h2>
          <p style={{color: '#6c757d'}}>Contenido del perfil del comercio...</p>
        </div>
      ),
    };

    return content[active] || <div className="content-card fade-in">Selecciona una opción del menú</div>;
  };

  return (
    <div className="dashboard-container flex h-screen">
      {/* Sidebar como componente separado */}
      <Sidebar active={active} setActive={setActive} />
      
      {/* Contenido principal */}
      <main className="main-content flex-1 overflow-y-auto">
        <div className="content-wrapper min-h-full p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}