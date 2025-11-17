import "../../styles/screens/DashboardScreen.css";
import Sidebar from "../../components/screens/Sidebar";
import { TrendingUp, Users, Package, ShoppingCart, RefreshCw, AlertCircle, Clock, Tag, FileText, User, Bell } from 'lucide-react';
import { useDashboard } from "../../hooks/useDashboard";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function DashboardScreen() {
  const { user } = useAuth();
  const { estadisticas, pedidosHoy, productos, recargarDatos } = useDashboard();
  const navigate = useNavigate();

  const getClaseTendencia = (valor) => {
    if (valor > 0) return 'trend-success';
    if (valor < 0) return 'trend-danger';
    return 'trend-neutral';
  };

  return (
    <div className="dashboard-container flex h-screen">
      <Sidebar />
      
      <main className="main-content flex-1 overflow-y-auto">
        <div className="content-wrapper min-h-full p-8">
          <div className="fade-in">
            {/* Header */}
            <div className="content-header">
              <div className="flex items-center justify-between w-full" >
                <div className="flex items-center gap-4">
                  <div>
                    <h1 className="content-title">Bienvenido, {user?.NombreComercio || 'Comercio'}</h1>
                    <p className="text-gray-600 text-lg mt-1 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      Resumen general de tu negocio
                    </p>
                  </div>
                </div>
                  <button 
                  onClick={recargarDatos}
                  className="btn-actualizar"
                >
                  <RefreshCw size={16} />
                  Actualizar
                </button>
              </div>
            </div>

            <div className="stats-grid">             
              {/* Pedidos Activos */}
              <div className="stat-card stat-secondary">
                <div className="stat-label">Pedidos Activos</div>
                <div className="stat-value">{pedidosHoy?.total || 0}</div>
                <div className="stat-trend trend-warning">
                  <Users size={16} />
                  <span style={{marginLeft: '4px'}}>
                    {pedidosHoy?.pendientes || 0} pendientes
                  </span>
                </div>
              </div>
              
              {/* Productos */}
              <div className="stat-card stat-primary">
                <div className="stat-label">Productos Activos</div>
                <div className="stat-value">{productos?.total || 0}</div>
              </div>
              
              {/* Clientes Nuevos */}
              <div className="stat-card stat-secondary">
                <div className="stat-label">Clientes Nuevos</div>
                <div className="stat-value">{estadisticas?.clientesNuevos || 0}</div>
                <div className={`stat-trend ${getClaseTendencia(estadisticas?.crecimientoClientes || 0)}`}>
                  <TrendingUp size={16} />
                  <span style={{marginLeft: '4px'}}>
                    {estadisticas?.crecimientoClientes >= 0 ? '+' : ''}
                    {estadisticas?.crecimientoClientes || 0}% este mes
                  </span>
                </div>
              </div>
            </div>
            
            <div className="alertas-section">
              <div className="alertas-header">
                <Bell size={20} />
                <h2>Notificaciones</h2>
              </div>
              
              <div className="alertas-grid">
                {pedidosHoy?.pendientes > 0 && (
                  <div className="alerta-card alerta-warning">
                    <div className="alerta-icon">
                      <ShoppingCart size={24} />
                    </div>
                    <div className="alerta-content">
                      <h3>Pedidos Pendientes</h3>
                      <p>Tienes {pedidosHoy.pendientes} pedido{pedidosHoy.pendientes > 1 ? 's' : ''} pendiente{pedidosHoy.pendientes > 1 ? 's' : ''} por procesar</p>
                    </div>
                    <button 
                      className="alerta-btn"
                      onClick={() => navigate('/pedidos')}
                    >
                      Ver Pedidos
                    </button>
                  </div>
                )}
                
                {pedidosHoy?.nuevos > 0 && (
                  <div className="alerta-card alerta-success">
                    <div className="alerta-icon">
                      <Bell size={24} />
                    </div>
                    <div className="alerta-content">
                      <h3>Nuevos Pedidos</h3>
                      <p>{pedidosHoy.nuevos} pedido{pedidosHoy.nuevos > 1 ? 's' : ''} nuevo{pedidosHoy.nuevos > 1 ? 's' : ''} recibido{pedidosHoy.nuevos > 1 ? 's' : ''} hoy</p>
                    </div>
                    <button 
                      className="alerta-btn"
                      onClick={() => navigate('/pedidos')}
                    >
                      Ver Pedidos
                    </button>
                  </div>
                )}
                
                {productos?.stockBajo > 0 && (
                  <div className="alerta-card alerta-danger">
                    <div className="alerta-icon">
                      <Package size={24} />
                    </div>
                    <div className="alerta-content">
                      <h3>Stock Bajo</h3>
                      <p>{productos.stockBajo} producto{productos.stockBajo > 1 ? 's' : ''} con stock bajo</p>
                    </div>
                    <button 
                      className="alerta-btn"
                      onClick={() => navigate('/productos')}
                    >
                      Ver Productos
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="accesos-rapidos">
              <h2 className="accesos-title">Accesos Rápidos</h2>
              <div className="accesos-grid">
                <button 
                  className="acceso-card"
                  onClick={() => navigate('/productos')}
                >
                  <Package size={32} />
                  <span>Productos</span>
                </button>
                
                <button 
                  className="acceso-card"
                  onClick={() => navigate('/categorias')}
                >
                  <Tag size={32} />
                  <span>Categorías</span>
                </button>
                
                <button 
                  className="acceso-card"
                  onClick={() => navigate('/pedidos')}
                >
                  <ShoppingCart size={32} />
                  <span>Pedidos</span>
                </button>
                
                <button 
                  className="acceso-card"
                  onClick={() => navigate('/horarios')}
                >
                  <Clock size={32} />
                  <span>Horarios</span>
                </button>
                
                <button 
                  className="acceso-card"
                  onClick={() => navigate('/perfil')}
                >
                  <User size={32} />
                  <span>Perfil</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
