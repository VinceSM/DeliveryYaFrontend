// src/screens/Pedidos/PedidosScreen.jsx
import { useState, useEffect } from "react";
import "../../styles/screens/PedidosScreen.css";
import Sidebar from "../../components/screens/Sidebar";
import { usePedidos } from "../../hooks/usePedidos";
import { ShoppingCart, Search, Filter, Plus, Clock, CheckCircle, XCircle, Loader, DollarSign } from "lucide-react";

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
    marcarComoPagado,
    marcarComoNoPagado
  } = usePedidos();

  // Función para formatear los datos del pedido según tu modelo
  const formatearPedido = (pedido) => {
    // Mapear estados según tu base de datos
    const estadoMapping = {
      1: { texto: 'pendiente', color: '#FF4D4D' },
      2: { texto: 'confirmado', color: '#FFC947' },
      3: { texto: 'preparando', color: '#FFC947' },
      4: { texto: 'en camino', color: '#4D79FF' },
      5: { texto: 'entregado', color: '#28a745' },
      6: { texto: 'cancelado', color: '#6c757d' }
    };

    const estadoInfo = estadoMapping[pedido.EstadoPedidoIdEstado] || { texto: 'pendiente', color: '#FF4D4D' };

    // Calcular total si no está en el pedido
    const total = pedido.subtotalPedido || 
                 (pedido.ItemsPedido?.reduce((sum, item) => sum + (item.total || 0), 0) || 0);

    return {
      id: pedido.idpedido,
      cliente: pedido.Cliente?.nombre || `Cliente ${pedido.ClienteIdCliente}`,
      items: pedido.ItemsPedido?.length || 0,
      total: total,
      estado: estadoInfo.texto,
      estadoColor: estadoInfo.color,
      tiempo: calcularTiempo(pedido.fecha),
      direccion: obtenerDireccion(pedido),
      fecha: pedido.fecha,
      pagado: pedido.pagado,
      codigo: pedido.codigo,
      datosOriginales: pedido
    };
  };

  const obtenerDireccion = (pedido) => {
    // Aquí deberías obtener la dirección real del cliente
    // Por ahora usamos un placeholder
    return pedido.Cliente?.direccion || 'Dirección no disponible';
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

  const pedidosFormateados = pedidos.map(formatearPedido);

  const pedidosFiltrados = pedidosFormateados.filter(pedido => {
    const coincideBusqueda = pedido.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
                           pedido.direccion.toLowerCase().includes(busqueda.toLowerCase()) ||
                           pedido.codigo?.toLowerCase().includes(busqueda.toLowerCase());
    const coincideEstado = filtroEstado === "todos" || pedido.estado === filtroEstado;
    return coincideBusqueda && coincideEstado;
  });

  const getEstadoIcono = (estado) => {
    switch (estado) {
      case "pendiente": return <Clock size={16} />;
      case "confirmado": return <CheckCircle size={16} />;
      case "preparando": return <Clock size={16} />;
      case "en camino": return <Clock size={16} />;
      case "entregado": return <CheckCircle size={16} />;
      case "cancelado": return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const handleAceptarPedido = async (pedidoId) => {
    const success = await aceptarPedido(pedidoId);
    if (success) {
      // Puedes agregar una notificación aquí
      console.log('Pedido aceptado');
    }
  };

  const handleRechazarPedido = async (pedidoId) => {
    const success = await rechazarPedido(pedidoId);
    if (success) {
      console.log('Pedido rechazado');
    }
  };

  const handleCompletarPedido = async (pedidoId) => {
    const success = await completarPedido(pedidoId);
    if (success) {
      console.log('Pedido completado');
    }
  };

  const handleTogglePago = async (pedidoId, actualmentePagado) => {
    const success = actualmentePagado 
      ? await marcarComoNoPagado(pedidoId)
      : await marcarComoPagado(pedidoId);
    
    if (success) {
      console.log(`Pedido ${actualmentePagado ? 'marcado como no pagado' : 'marcado como pagado'}`);
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
              onClick={() => window.location.reload()}
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
              <button className="btn-primary">
                <Plus size={18} />
                Nuevo Pedido
              </button>
            </div>
          </div>

          {/* Filtros y Búsqueda */}
          <div className="filtros-pedidos">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Buscar por cliente, dirección o código..."
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
                      {getEstadoIcono(pedido.estado)}
                      <span>{pedido.estado}</span>
                    </div>
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
                    {pedido.estado === 'pendiente' && (
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
                    )}
                    {pedido.estado === 'preparando' && (
                      <button 
                        className="btn-accion btn-completar"
                        onClick={() => handleCompletarPedido(pedido.id)}
                      >
                        <CheckCircle size={16} />
                        Marcar como Listo
                      </button>
                    )}
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
              <div className="estadistica-icon" style={{ backgroundColor: 'rgba(255, 77, 77, 0.1)' }}>
                <Clock size={24} color="#FF4D4D" />
              </div>
              <div className="estadistica-info">
                <h3>Pendientes</h3>
                <p>{pedidosFormateados.filter(p => p.estado === 'pendiente').length} pedidos</p>
              </div>
            </div>
            
            <div className="estadistica-card">
              <div className="estadistica-icon" style={{ backgroundColor: 'rgba(255, 201, 71, 0.1)' }}>
                <Clock size={24} color="#FFC947" />
              </div>
              <div className="estadistica-info">
                <h3>En Preparación</h3>
                <p>{pedidosFormateados.filter(p => p.estado === 'preparando').length} pedidos</p>
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
              <div className="estadistica-icon" style={{ backgroundColor: 'rgba(77, 121, 255, 0.1)' }}>
                <DollarSign size={24} color="#4D79FF" />
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