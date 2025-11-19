import { useState, useEffect } from "react";
import "../../styles/screens/PedidosScreen.css";
import Sidebar from "../../components/screens/Sidebar";
import { usePedidos } from "../../hooks/usePedidos";
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader, 
  DollarSign,
  Truck,
  Package
} from "lucide-react";

export default function PedidosScreen() {
  const [active, setActive] = useState("pedidos");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  
  const { 
    pedidos, 
    loading, 
    error, 
    aceptarPedido, 
    rechazarPedido, 
    completarPedido,
    marcarComoEntregado,
    marcarComoPagado,
    marcarComoNoPagado,
    refrescarPedidos
  } = usePedidos();

  // Función para formatear los datos del pedido según tu modelo
  const formatearPedido = (pedido) => {
    // Mapear estados según tu base de datos
    const estadoMapping = {
      1: { texto: 'pendiente', color: '#FFA726', icono: <Clock size={16} /> },
      2: { texto: 'confirmado', color: '#29B6F6', icono: <CheckCircle size={16} /> },
      3: { texto: 'preparando', color: '#FFCA28', icono: <Package size={16} /> },
      4: { texto: 'en camino', color: '#4D79FF', icono: <Truck size={16} /> },
      5: { texto: 'entregado', color: '#28a745', icono: <CheckCircle size={16} /> },
      6: { texto: 'cancelado', color: '#6c757d', icono: <XCircle size={16} /> }
    };

    const estadoInfo = estadoMapping[pedido.EstadoPedidoIdEstado] || { 
      texto: 'pendiente', 
      color: '#FFA726', 
      icono: <Clock size={16} /> 
    };

    // Calcular total del pedido para este comercio específico
    const total = pedido.ItemsPedido
      ?.filter(item => item.ComercioIdComercio === pedido.comercioId) // Filtrar items del comercio actual
      ?.reduce((sum, item) => sum + (item.total || 0), 0) || 0;

    // Obtener items del comercio actual
    const itemsDelComercio = pedido.ItemsPedido
      ?.filter(item => item.ComercioIdComercio === pedido.comercioId) || [];

    return {
      id: pedido.idpedido,
      cliente: pedido.Cliente?.nombre || `Cliente ${pedido.ClienteIdCliente}`,
      telefono: pedido.Cliente?.telefono || 'No disponible',
      items: itemsDelComercio.length,
      itemsDetalles: itemsDelComercio,
      total: total,
      estado: estadoInfo.texto,
      estadoId: pedido.EstadoPedidoIdEstado,
      estadoColor: estadoInfo.color,
      estadoIcono: estadoInfo.icono,
      tiempo: calcularTiempo(pedido.fecha),
      direccion: pedido.DireccionEnvio || 'Dirección no disponible',
      fecha: pedido.fecha,
      pagado: pedido.pagado || false,
      codigo: pedido.codigo,
      datosOriginales: pedido
    };
  };

  const calcularTiempo = (fecha) => {
    if (!fecha) return 'N/A';
    
    const ahora = new Date();
    const fechaPedido = new Date(fecha);
    const diffMs = ahora - fechaPedido;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} min`;
    } else {
      const diffHours = Math.floor(diffMins / 60);
      return `${diffHours} h`;
    }
  };

  const pedidosFormateados = pedidos.map(pedido => ({
    ...formatearPedido(pedido),
    comercioId: pedido.comercioId // Asegurar que tenemos el ID del comercio
  }));

  const pedidosFiltrados = pedidosFormateados.filter(pedido => {
    const coincideBusqueda = 
      pedido.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
      pedido.direccion.toLowerCase().includes(busqueda.toLowerCase()) ||
      pedido.codigo?.toLowerCase().includes(busqueda.toLowerCase()) ||
      pedido.telefono?.includes(busqueda);
    
    const coincideEstado = filtroEstado === "todos" || pedido.estado === filtroEstado;
    
    return coincideBusqueda && coincideEstado;
  });

  const handleAceptarPedido = async (pedidoId) => {
    const success = await aceptarPedido(pedidoId);
    if (success) {
      console.log('✅ Pedido aceptado');
    }
  };

  const handleRechazarPedido = async (pedidoId) => {
    const success = await rechazarPedido(pedidoId);
    if (success) {
      console.log('❌ Pedido rechazado');
    }
  };

  const handleCompletarPedido = async (pedidoId) => {
    const success = await completarPedido(pedidoId);
    if (success) {
      console.log('🚚 Pedido marcado como en camino');
    }
  };

  const handleMarcarEntregado = async (pedidoId) => {
    const success = await marcarComoEntregado(pedidoId);
    if (success) {
      console.log('🎉 Pedido marcado como entregado');
    }
  };

  const handleTogglePago = async (pedidoId, actualmentePagado) => {
    const success = actualmentePagado 
      ? await marcarComoNoPagado(pedidoId)
      : await marcarComoPagado(pedidoId);
    
    if (success) {
      console.log(`💰 Pedido ${actualmentePagado ? 'marcado como no pagado' : 'marcado como pagado'}`);
    }
  };

  // Función para renderizar las acciones según el estado
  const renderAcciones = (pedido) => {
    switch (pedido.estadoId) {
      case 1: // PENDIENTE
        return (
          <>
            <button 
              className="btn-accion btn-aceptar"
              onClick={() => handleAceptarPedido(pedido.id)}
            >
              <CheckCircle size={16} />
              Aceptar
            </button>
            <button 
              className="btn-accion btn-rechazar"
              onClick={() => handleRechazarPedido(pedido.id)}
            >
              <XCircle size={16} />
              Rechazar
            </button>
          </>
        );
      
      case 2: // CONFIRMADO
      case 3: // PREPARANDO
        return (
          <button 
            className="btn-accion btn-completar"
            onClick={() => handleCompletarPedido(pedido.id)}
          >
            <Truck size={16} />
            Marcar como En Camino
          </button>
        );
      
      case 4: // EN CAMINO
        return (
          <button 
            className="btn-accion btn-entregado"
            onClick={() => handleMarcarEntregado(pedido.id)}
          >
            <CheckCircle size={16} />
            Marcar como Entregado
          </button>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container flex h-screen">
        <Sidebar active={active} setActive={setActive} />
        <main className="main-content flex-1 overflow-y-auto flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader size={32} className="animate-spin mb-4" />
            <p>Cargando pedidos...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container flex h-screen">
        <Sidebar active={active} setActive={setActive} />
        <main className="main-content flex-1 overflow-y-auto flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error: {error}</p>
            <button 
              onClick={refrescarPedidos}
              className="btn-primary"
            >
              Reintentar
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-container flex h-screen">
      <Sidebar active={active} setActive={setActive} />
      
      <main className="main-content flex-1 overflow-y-auto">
        <div className="content-wrapper min-h-full p-8">
          {/* Header */}
          <div className="content-header">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="content-title">Gestión de Pedidos</h1>
                <p className="content-subtitle">
                  {pedidosFormateados.length} pedidos en total • {pedidosFiltrados.length} filtrados
                </p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={refrescarPedidos}
                  className="btn-secondary"
                >
                  <Loader size={18} />
                  Actualizar
                </button>
              </div>
            </div>
          </div>

          {/* Filtros y Búsqueda */}
          <div className="filtros-pedidos">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Buscar por cliente, dirección, teléfono o código..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filtros-estado">
              <Filter size={16} />
              <select 
                value={filtroEstado} 
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="estado-select"
              >
                <option value="todos">Todos los estados</option>
                <option value="pendiente">Pendientes</option>
                <option value="confirmado">Confirmados</option>
                <option value="preparando">En preparación</option>
                <option value="en camino">En camino</option>
                <option value="entregado">Entregados</option>
                <option value="cancelado">Cancelados</option>
              </select>
            </div>
          </div>

          {/* Lista de Pedidos */}
          <div className="pedidos-grid">
            {pedidosFiltrados.length === 0 ? (
              <div className="no-pedidos">
                <ShoppingCart size={48} className="mb-4 text-gray-400" />
                <h3>No hay pedidos</h3>
                <p>No se encontraron pedidos con los filtros aplicados</p>
              </div>
            ) : (
              pedidosFiltrados.map((pedido) => (
                <div key={pedido.id} className="pedido-card">
                  <div className="pedido-header">
                    <div className="pedido-info">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="pedido-cliente">{pedido.cliente}</h3>
                          <p className="pedido-direccion">{pedido.direccion}</p>
                          <p className="pedido-telefono text-sm text-gray-600">
                            📞 {pedido.telefono}
                          </p>
                          {pedido.codigo && (
                            <p className="pedido-codigo">Código: {pedido.codigo}</p>
                          )}
                        </div>
                        <div className={`pago-indicator ${pedido.pagado ? 'pagado' : 'no-pagado'}`}>
                          <DollarSign size={14} />
                          <span>{pedido.pagado ? 'Pagado' : 'Pendiente'}</span>
                        </div>
                      </div>
                      <p className="pedido-fecha text-sm text-gray-500 mt-1">
                        {new Date(pedido.fecha).toLocaleDateString()} - {new Date(pedido.fecha).toLocaleTimeString()}
                      </p>
                    </div>
                    <div 
                      className="pedido-estado"
                      style={{ backgroundColor: pedido.estadoColor }}
                    >
                      {pedido.estadoIcono}
                      <span>{pedido.estado}</span>
                    </div>
                  </div>
                  
                  {/* Detalles de items del pedido */}
                  <div className="pedido-items">
                    <h4 className="items-title">Productos:</h4>
                    {pedido.itemsDetalles.map((item, index) => (
                      <div key={index} className="item-detalle">
                        <span className="item-nombre">{item.nombre || `Producto ${item.ProductoIdProducto}`}</span>
                        <span className="item-cantidad">{item.cantidad}x</span>
                        <span className="item-precio">${(item.precioUnitario || 0).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pedido-detalles">
                    <div className="detalle-item">
                      <span className="detalle-label">Items:</span>
                      <span className="detalle-valor">{pedido.items}</span>
                    </div>
                    <div className="detalle-item">
                      <span className="detalle-label">Total:</span>
                      <span className="detalle-valor">${pedido.total.toFixed(2)}</span>
                    </div>
                    <div className="detalle-item">
                      <span className="detalle-label">Tiempo:</span>
                      <span className="detalle-valor">{pedido.tiempo}</span>
                    </div>
                  </div>
                  
                  <div className="pedido-acciones">
                    {renderAcciones(pedido)}
                    
                    <button 
                      className={`btn-accion ${pedido.pagado ? 'btn-no-pagado' : 'btn-pagado'}`}
                      onClick={() => handleTogglePago(pedido.id, pedido.pagado)}
                    >
                      <DollarSign size={16} />
                      {pedido.pagado ? 'Marcar No Pagado' : 'Marcar Pagado'}
                    </button>
                    
                    <button className="btn-accion btn-detalles">
                      Ver Detalles
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Estadísticas */}
          <div className="estadisticas-pedidos">
            <div className="estadistica-card">
              <div className="estadistica-icon" style={{ backgroundColor: 'rgba(255, 167, 38, 0.1)' }}>
                <Clock size={24} color="#FFA726" />
              </div>
              <div className="estadistica-info">
                <h3>Pendientes</h3>
                <p>{pedidosFormateados.filter(p => p.estado === 'pendiente').length} pedidos</p>
              </div>
            </div>
            
            <div className="estadistica-card">
              <div className="estadistica-icon" style={{ backgroundColor: 'rgba(41, 182, 246, 0.1)' }}>
                <CheckCircle size={24} color="#29B6F6" />
              </div>
              <div className="estadistica-info">
                <h3>Confirmados</h3>
                <p>{pedidosFormateados.filter(p => p.estado === 'confirmado').length} pedidos</p>
              </div>
            </div>
            
            <div className="estadistica-card">
              <div className="estadistica-icon" style={{ backgroundColor: 'rgba(255, 202, 40, 0.1)' }}>
                <Package size={24} color="#FFCA28" />
              </div>
              <div className="estadistica-info">
                <h3>En Preparación</h3>
                <p>{pedidosFormateados.filter(p => p.estado === 'preparando').length} pedidos</p>
              </div>
            </div>

            <div className="estadistica-card">
              <div className="estadistica-icon" style={{ backgroundColor: 'rgba(77, 121, 255, 0.1)' }}>
                <Truck size={24} color="#4D79FF" />
              </div>
              <div className="estadistica-info">
                <h3>En Camino</h3>
                <p>{pedidosFormateados.filter(p => p.estado === 'en camino').length} pedidos</p>
              </div>
            </div>

            <div className="estadistica-card">
              <div className="estadistica-icon" style={{ backgroundColor: 'rgba(40, 167, 69, 0.1)' }}>
                <CheckCircle size={24} color="#28a745" />
              </div>
              <div className="estadistica-info">
                <h3>Entregados</h3>
                <p>{pedidosFormateados.filter(p => p.estado === 'entregado').length} pedidos</p>
              </div>
            </div>

            <div className="estadistica-card">
              <div className="estadistica-icon" style={{ backgroundColor: 'rgba(108, 117, 125, 0.1)' }}>
                <DollarSign size={24} color="#6c757d" />
              </div>
              <div className="estadistica-info">
                <h3>Pagados</h3>
                <p>{pedidosFormateados.filter(p => p.pagado).length} pedidos</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}