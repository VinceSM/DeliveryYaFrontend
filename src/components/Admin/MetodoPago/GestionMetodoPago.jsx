import React, { useState, useEffect } from 'react';
import { adminMetodoPagoAPI } from '../../../api/adminMetodoPago';
import './GestionMetodoPago.css';

const GestionMetodoPago = () => {
  const [metodos, setMetodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMetodo, setEditingMetodo] = useState(null);
  const [formData, setFormData] = useState({
    metodo: '',
    descripcion: '',
    activo: true
  });

  const totalPages = Math.ceil(totalItems / pageSize);

  // Cargar métodos de pago
  const fetchMetodos = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminMetodoPagoAPI.getAllMetodos(currentPage, pageSize, searchTerm);
      setMetodos(response.data || response);
      setTotalItems(response.totalCount || response.length || 0);
    } catch (err) {
      setError('Error al cargar los métodos de pago');
      console.error('Error fetching metodos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetodos();
  }, [currentPage, pageSize, searchTerm]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCreate = () => {
    setEditingMetodo(null);
    setFormData({ metodo: '', descripcion: '', activo: true });
    setShowModal(true);
  };

  const handleEdit = (metodo) => {
    setEditingMetodo(metodo);
    setFormData({
      metodo: metodo.metodo,
      descripcion: metodo.descripcion || '',
      activo: metodo.activo !== false
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este método de pago?')) {
      try {
        await adminMetodoPagoAPI.deleteMetodo(id);
        fetchMetodos();
      } catch (err) {
        setError('Error al eliminar el método de pago');
        console.error('Error deleting metodo:', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMetodo) {
        await adminMetodoPagoAPI.updateMetodo(editingMetodo.idmetodo, formData);
      } else {
        await adminMetodoPagoAPI.createMetodo(formData);
      }
      setShowModal(false);
      fetchMetodos();
    } catch (err) {
      setError(`Error al ${editingMetodo ? 'actualizar' : 'crear'} el método de pago`);
      console.error('Error submitting metodo:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const toggleActivo = async (id, currentState) => {
    try {
      await adminMetodoPagoAPI.updateMetodo(id, { activo: !currentState });
      fetchMetodos();
    } catch (err) {
      setError('Error al cambiar el estado del método de pago');
      console.error('Error toggling activo:', err);
    }
  };

  return (
    <div className="gestion-metodo-pago">
      <div className="section-header">
        <h2>Gestión de Métodos de Pago</h2>
        <button className="btn-primary" onClick={handleCreate}>
          + Nuevo Método
        </button>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar por método"
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
      </div>

      {/* Mensaje de Error */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Tabla de Métodos de Pago */}
      <div className="table-container">
        {loading ? (
          <div className="loading">Cargando métodos de pago...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Método</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {metodos.length > 0 ? (
                metodos.map((metodo) => (
                  <tr key={metodo.idmetodo}>
                    <td>{metodo.idmetodo}</td>
                    <td>
                      <span className="metodo-nombre">
                        {metodo.metodo}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`status-toggle ${metodo.activo ? 'activo' : 'inactivo'}`}
                        onClick={() => toggleActivo(metodo.idmetodo, metodo.activo)}
                        title={metodo.activo ? 'Desactivar' : 'Activar'}
                      >
                        {metodo.activo ? '✅ Activo' : '❌ Inactivo'}
                      </button>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(metodo)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(metodo.idmetodo)}
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">
                    No se encontraron métodos de pago
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal para Crear/Editar */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingMetodo ? 'Editar Método' : 'Nuevo Método'}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="metodo">Método *</label>
                <input
                  type="text"
                  id="metodo"
                  name="metodo"
                  value={formData.metodo}
                  onChange={handleInputChange}
                  required
                  placeholder="Ej: EFECTIVO, TARJETA, TRANSFERENCIA, etc."
                />
              </div>
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="activo"
                    checked={formData.activo}
                    onChange={handleInputChange}
                  />
                  <span className="checkmark"></span>
                  Método activo
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingMetodo ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionMetodoPago;