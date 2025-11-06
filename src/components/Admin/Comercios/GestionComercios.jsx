// src/components/Admin/Comercios/GestionComercios.jsx
import { useState, useEffect } from 'react';
import { useAdminComercios } from '../../../hooks/useAdminComercios';
import ComerciosGrid from './ComerciosGrid';

export default function GestionComercios() {
  const { 
    comercios, 
    comerciosPendientes, 
    comerciosActivos, 
    loading, 
    error, 
    estadisticas,
    cargarComercios 
  } = useAdminComercios();

  const [filtro, setFiltro] = useState('todos'); // 'todos', 'pendientes', 'activos'

  // Filtrar comercios según el filtro seleccionado
  const comerciosFiltrados = filtro === 'pendientes' 
    ? comerciosPendientes 
    : filtro === 'activos' 
    ? comerciosActivos 
    : comercios;

  // Cargar comercios al montar el componente
  useEffect(() => {
    cargarComercios();
  }, [cargarComercios]);

  const handleRecargar = () => {
    cargarComercios();
  };

  return (
    <div className="section-container">
      <div className="section-header">
        <div>
          <h2>Gestión de Comercios</h2>
          <p className="section-subtitle">
            Administra los comercios del sistema
          </p>
        </div>
        <div className="header-actions">
          <button 
            className="btn-secondary" 
            onClick={handleRecargar}
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Actualizar'}
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{estadisticas.total}</h3>
          <p>Total Comercios</p>
        </div>
        <div className="stat-card">
          <h3>{estadisticas.pendientes}</h3>
          <p>Pendientes</p>
        </div>
        <div className="stat-card">
          <h3>{estadisticas.activos}</h3>
          <p>Activos</p>
        </div>
        <div className="stat-card">
          <h3>{estadisticas.destacados}</h3>
          <p>Destacados</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filtro === 'todos' ? 'active' : ''}`}
            onClick={() => setFiltro('todos')}
          >
            Todos ({estadisticas.total})
          </button>
          <button 
            className={`filter-tab ${filtro === 'pendientes' ? 'active' : ''}`}
            onClick={() => setFiltro('pendientes')}
          >
            Pendientes ({estadisticas.pendientes})
          </button>
          <button 
            className={`filter-tab ${filtro === 'activos' ? 'active' : ''}`}
            onClick={() => setFiltro('activos')}
          >
            Activos ({estadisticas.activos})
          </button>
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
          <button onClick={handleRecargar}>Reintentar</button>
        </div>
      )}

      {/* Grid de comercios */}
      <ComerciosGrid 
        comercios={comerciosFiltrados} 
        loading={loading}
        filtro={filtro}
      />
    </div>
  );
}