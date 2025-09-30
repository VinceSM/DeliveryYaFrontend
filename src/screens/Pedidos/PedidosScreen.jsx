import { useState } from "react";
import "../../styles/screens/PedidosScreen.css";
import Sidebar from "../../components/screens/Sidebar";
import { ShoppingCart, Search, Filter, Plus, Clock, CheckCircle, XCircle } from "lucide-react";

// Datos de ejemplo para pedidos
const pedidosEjemplo = [
  {
    id: 1,
    cliente: "Juan Pérez",
    items: 3,
    total: 45.50,
    estado: "pendiente",
    tiempo: "15 min",
    direccion: "Av. Principal 123"
  },
  {
    id: 2,
    cliente: "María García",
    items: 2,
    total: 28.00,
    estado: "preparando",
    tiempo: "25 min",
    direccion: "Calle Secundaria 456"
  },
  {
    id: 3,
    cliente: "Carlos López",
    items: 1,
    total: 15.75,
    estado: "entregado",
    tiempo: "40 min",
    direccion: "Plaza Central 789"
  },
  {
    id: 4,
    cliente: "Ana Martínez",
    items: 4,
    total: 62.30,
    estado: "pendiente",
    tiempo: "10 min",
    direccion: "Boulevard Norte 321"
  }
];

export default function PedidosScreen() {
  const [active, setActive] = useState("pedidos");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");

  const pedidosFiltrados = pedidosEjemplo.filter(pedido => {
    const coincideBusqueda = pedido.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
                           pedido.direccion.toLowerCase().includes(busqueda.toLowerCase());
    const coincideEstado = filtroEstado === "todos" || pedido.estado === filtroEstado;
    return coincideBusqueda && coincideEstado;
  });

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "pendiente": return "#FF4D4D";
      case "preparando": return "#FFC947";
      case "entregado": return "#28a745";
      default: return "#6c757d";
    }
  };

  const getEstadoIcono = (estado) => {
    switch (estado) {
      case "pendiente": return <Clock size={16} />;
      case "preparando": return <Clock size={16} />;
      case "entregado": return <CheckCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

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
                <p className="content-subtitle">Administra y sigue los pedidos de tu comercio</p>
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
                placeholder="Buscar por cliente o dirección..."
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
                <option value="preparando">En preparación</option>
                <option value="entregado">Entregados</option>
              </select>
            </div>
          </div>

          {/* Lista de Pedidos */}
          <div className="pedidos-grid">
            {pedidosFiltrados.map((pedido) => (
              <div key={pedido.id} className="pedido-card">
                <div className="pedido-header">
                  <div className="pedido-info">
                    <h3 className="pedido-cliente">{pedido.cliente}</h3>
                    <p className="pedido-direccion">{pedido.direccion}</p>
                  </div>
                  <div 
                    className="pedido-estado"
                    style={{ backgroundColor: getEstadoColor(pedido.estado) }}
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
                    <span className="detalle-valor">${pedido.total}</span>
                  </div>
                  <div className="detalle-item">
                    <span className="detalle-label">Tiempo:</span>
                    <span className="detalle-valor">{pedido.tiempo}</span>
                  </div>
                </div>
                
                <div className="pedido-acciones">
                  <button className="btn-accion btn-aceptar">
                    <CheckCircle size={16} />
                    Aceptar
                  </button>
                  <button className="btn-accion btn-rechazar">
                    <XCircle size={16} />
                    Rechazar
                  </button>
                  <button className="btn-accion btn-detalles">
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Estadísticas */}
          <div className="estadisticas-pedidos">
            <div className="estadistica-card">
              <div className="estadistica-icon" style={{ backgroundColor: 'rgba(255, 77, 77, 0.1)' }}>
                <Clock size={24} color="#FF4D4D" />
              </div>
              <div className="estadistica-info">
                <h3>Pendientes</h3>
                <p>{pedidosEjemplo.filter(p => p.estado === 'pendiente').length} pedidos</p>
              </div>
            </div>
            
            <div className="estadistica-card">
              <div className="estadistica-icon" style={{ backgroundColor: 'rgba(255, 201, 71, 0.1)' }}>
                <Clock size={24} color="#FFC947" />
              </div>
              <div className="estadistica-info">
                <h3>En Preparación</h3>
                <p>{pedidosEjemplo.filter(p => p.estado === 'preparando').length} pedidos</p>
              </div>
            </div>
            
            <div className="estadistica-card">
              <div className="estadistica-icon" style={{ backgroundColor: 'rgba(40, 167, 69, 0.1)' }}>
                <CheckCircle size={24} color="#28a745" />
              </div>
              <div className="estadistica-info">
                <h3>Entregados</h3>
                <p>{pedidosEjemplo.filter(p => p.estado === 'entregado').length} pedidos</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}