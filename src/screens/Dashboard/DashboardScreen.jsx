import "../../styles/screens/DashboardScreen.css";
import Sidebar from "../../components/screens/Sidebar";
import { TrendingUp, Users, Package, ShoppingCart, RefreshCw, AlertCircle } from "lucide-react";
import { useDashboard } from "../../hooks/useDashboard";
import { useAuth } from "../../hooks/useAuth";

export default function DashboardScreen() {
  const { user } = useAuth();
  const { estadisticas, pedidosHoy, productos, loading, error, recargarDatos } = useDashboard();

  // Función para formatear moneda
  const formatearMoneda = (monto) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(monto);
  };

  // Función para determinar la clase de tendencia
  const getClaseTendencia = (valor) => {
    return valor >= 0 ? 'trend-positive' : 'trend-negative';
  };

  if (loading) {
    return (
      <div className="dashboard-container flex h-screen">
        <Sidebar />
        <main className="main-content flex-1 overflow-y-auto">
          <div className="content-wrapper min-h-full p-8 flex items-center justify-center">
            <div className="text-center">
              <RefreshCw size={48} className="animate-spin mx-auto mb-4 text-blue-500" />
              <p className="text-gray-600">Cargando datos del dashboard...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container flex h-screen">
        <Sidebar />
        <main className="main-content flex-1 overflow-y-auto">
          <div className="content-wrapper min-h-full p-8 flex items-center justify-center">
            <div className="text-center">
              <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Error al cargar datos</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={recargarDatos}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-container flex h-screen">
      <Sidebar />
      
      <main className="main-content flex-1 overflow-y-auto">
        <div className="content-wrapper min-h-full p-8">
          <div className="fade-in">
            {/* Header */}
            <div className="content-header flex justify-between items-center">
              <div>
                <h1 className="content-title">Bienvenido, {user?.NombreComercio || 'Comercio'}</h1>
                <p className="content-subtitle">Resumen general de tu negocio</p>
              </div>
              <button 
                onClick={recargarDatos}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
              >
                <RefreshCw size={16} />
                Actualizar
              </button>
            </div>
            
            {/* Grid de Estadísticas */}
            <div className="stats-grid">
              {/* Ventas Hoy */}
              <div className="stat-card stat-primary">
                <div className="stat-label">Ventas Hoy</div>
                <div className="stat-value">
                  {estadisticas ? formatearMoneda(estadisticas.ventasHoy) : '$0'}
                </div>
                <div className={`stat-trend ${getClaseTendencia(estadisticas?.crecimientoVentas || 0)}`}>
                  <TrendingUp size={16} />
                  <span style={{marginLeft: '4px'}}>
                    {estadisticas?.crecimientoVentas >= 0 ? '+' : ''}
                    {estadisticas?.crecimientoVentas || 0}% vs ayer
                  </span>
                </div>
              </div>
              
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
                <div className="stat-label">Productos</div>
                <div className="stat-value">{productos?.total || 0}</div>
                <div className="stat-trend trend-warning">
                  <Package size={16} />
                  <span style={{marginLeft: '4px'}}>
                    {productos?.bajosStock || 0} bajos en stock
                  </span>
                </div>
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
            
            {/* Actividad Reciente */}
            <div className="content-card" style={{marginTop: '2rem'}}>
              <h2 style={{color: '#333333', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: '600'}}>
                Actividad Reciente
              </h2>
              
              {estadisticas?.actividadReciente && estadisticas.actividadReciente.length > 0 ? (
                <div className="space-y-3">
                  {estadisticas.actividadReciente.map((actividad) => (
                    <div key={actividad.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          actividad.tipo === 'pedido' ? 'bg-blue-100 text-blue-600' :
                          actividad.tipo === 'producto' ? 'bg-orange-100 text-orange-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {actividad.tipo === 'pedido' && <ShoppingCart size={16} />}
                          {actividad.tipo === 'producto' && <Package size={16} />}
                          {actividad.tipo === 'cliente' && <Users size={16} />}
                        </div>
                        <span className="text-gray-800">{actividad.descripcion}</span>
                      </div>
                      <span className="text-sm text-gray-500">{actividad.fecha}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{color: '#6c757d'}}>No hay actividad reciente para mostrar.</p>
              )}
            </div>

            {/* Información de Prueba */}
            {estadisticas && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  <strong>Nota:</strong> Actualmente se muestran datos de prueba. 
                  Conecta los endpoints reales en el backend para ver información en tiempo real.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}