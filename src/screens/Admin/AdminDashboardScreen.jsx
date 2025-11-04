// C:\Users\ASUS\DeliveryYa\DeliveryYaFrontend\src\screens\Admin\AdminDashboardScreen.jsx

import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import '../../styles/screens/Admin/AdminDashboard.css';

export default function AdminDashboardScreen() {
  const { admin, logout } = useAdminAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [stats, setStats] = useState({
    totalPedidos: 0,
    pedidosHoy: 0,
    totalClientes: 0,
    totalComercios: 0,
    totalRepartidores: 0,
    ingresosHoy: 0
  });

  // Secciones del dashboard
  const sections = {
    dashboard: 'Dashboard',
    pedidos: 'Pedidos',
    clientes: 'Clientes',
    comercios: 'Comercios',
    repartidores: 'Repartidores',
    reportes: 'Reportes'
  };

  // Datos de ejemplo para estadísticas (debes reemplazar con llamadas a tu API)
  useEffect(() => {
    // Simular carga de datos
    setStats({
      totalPedidos: 1250,
      pedidosHoy: 45,
      totalClientes: 890,
      totalComercios: 67,
      totalRepartidores: 32,
      ingresosHoy: 12500.50
    });
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview stats={stats} />;
      case 'pedidos':
        return <GestionPedidos />;
      case 'clientes':
        return <GestionClientes />;
      case 'comercios':
        return <GestionComercios />;
      case 'repartidores':
        return <GestionRepartidores />;
      case 'reportes':
        return <Reportes />;
      default:
        return <DashboardOverview stats={stats} />;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h2>DeliveryYa Admin</h2>
          <p>Bienvenido, {admin?.usuario}</p>
        </div>
        
        <nav className="sidebar-nav">
          {Object.entries(sections).map(([key, value]) => (
            <button
              key={key}
              className={`nav-item ${activeSection === key ? 'active' : ''}`}
              onClick={() => setActiveSection(key)}
            >
              {value}
            </button>
          ))}
        </nav>
        
        <button className="logout-btn" onClick={logout}>
          Cerrar Sesión
        </button>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        <header className="admin-header">
          <h1>{sections[activeSection]}</h1>
          <div className="header-actions">
            <span>{new Date().toLocaleDateString('es-ES')}</span>
          </div>
        </header>

        <div className="admin-content">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}

// Componentes para cada sección
function DashboardOverview({ stats }) {
  return (
    <div className="dashboard-overview">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Pedidos</h3>
          <p className="stat-number">{stats.totalPedidos}</p>
        </div>
        <div className="stat-card">
          <h3>Pedidos Hoy</h3>
          <p className="stat-number">{stats.pedidosHoy}</p>
        </div>
        <div className="stat-card">
          <h3>Total Clientes</h3>
          <p className="stat-number">{stats.totalClientes}</p>
        </div>
        <div className="stat-card">
          <h3>Total Comercios</h3>
          <p className="stat-number">{stats.totalComercios}</p>
        </div>
        <div className="stat-card">
          <h3>Repartidores</h3>
          <p className="stat-number">{stats.totalRepartidores}</p>
        </div>
        <div className="stat-card">
          <h3>Ingresos Hoy</h3>
          <p className="stat-number">${stats.ingresosHoy.toLocaleString()}</p>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Actividad Reciente</h3>
        {/* Aquí iría una lista de actividad reciente */}
      </div>
    </div>
  );
}

function GestionPedidos() {
  const [pedidos, setPedidos] = useState([]);

  return (
    <div className="section-container">
      <div className="section-header">
        <h2>Gestión de Pedidos</h2>
        <div className="filters">
          <select>
            <option>Todos los estados</option>
            <option>Pendiente</option>
            <option>En preparación</option>
            <option>En camino</option>
            <option>Entregado</option>
            <option>Cancelado</option>
          </select>
          <input type="date" placeholder="Fecha" />
        </div>
      </div>
      
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Comercio</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {/* Los datos de pedidos se cargarían aquí */}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GestionClientes() {
  return (
    <div className="section-container">
      <h2>Gestión de Clientes</h2>
      {/* Tabla de clientes con opciones de editar/eliminar */}
    </div>
  );
}

function GestionComercios() {
  const [comercios, setComercios] = useState([]);

  return (
    <div className="section-container">
      <div className="section-header">
        <h2>Gestión de Comercios</h2>
        <button className="btn-primary">+ Nuevo Comercio</button>
      </div>
      
      <div className="cards-grid">
        {/* Tarjetas de comercios con información básica */}
        {comercios.map(comercio => (
          <div key={comercio.idcomercio} className="comercio-card">
            <h4>{comercio.nombreComercio}</h4>
            <p>{comercio.tipoComercio}</p>
            <p>{comercio.ciudad}</p>
            <div className="card-actions">
              <button>Editar</button>
              <button>Ver Detalles</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GestionRepartidores() {
  return (
    <div className="section-container">
      <h2>Gestión de Repartidores</h2>
      {/* Tabla de repartidores con vehículos y estado */}
    </div>
  );
}

function Reportes() {
  return (
    <div className="section-container">
      <h2>Reportes y Estadísticas</h2>
      <div className="reports-grid">
        <div className="report-card">
          <h3>Ventas por Período</h3>
          {/* Gráfico de ventas */}
        </div>
        <div className="report-card">
          <h3>Comercios Más Populares</h3>
          {/* Ranking de comercios */}
        </div>
        <div className="report-card">
          <h3>Métodos de Pago</h3>
          {/* Gráfico de métodos de pago */}
        </div>
      </div>
    </div>
  );
}